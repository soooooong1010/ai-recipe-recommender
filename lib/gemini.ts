import { GoogleGenAI } from "@google/genai"
import { GeminiVisionRawOutputSchema, type DietMode, type Recipe } from "./schema"
import { RECIPES as FALLBACK_RECIPES } from "./recipe-data"

const apiKey = process.env.GEMINI_API_KEY

export function getGeminiClient(): GoogleGenAI | null {
  if (!apiKey) {
    return null
  }
  return new GoogleGenAI({ apiKey })
}

/**
 * 이미지로부터 식재료 목록을 인식하고 추출합니다.
 */
export async function extractIngredientsWithVision(
  base64Data: string,
  mimeType: string = "image/jpeg",
): Promise<{ ingredients: string[]; isRecognized: boolean }> {
  const ai = getGeminiClient()

  // API Key가 설정되지 않았거나 로컬 테스트용 기본 fallback
  if (!ai) {
    console.warn("[Gemini] GEMINI_API_KEY not found in environment. Using smart simulation mode.")
    if (base64Data.length > 500) {
      return {
        ingredients: ["두부", "계란", "대파", "애호박", "버섯", "당근", "양파", "치즈"],
        isRecognized: true,
      }
    }
    return {
      ingredients: [],
      isRecognized: false,
    }
  }

  try {
    const prompt = `
당신은 냉장고 속 식재료 전문 인식 AI입니다.
첨부된 사진을 분석하여 육안으로 식별 가능한 '식재료' 목록을 정확하게 추출하세요.

[규칙]
1. 사진 속에 식재료가 명확히 보이지 않거나, 식재료가 아닌 사물/풍경/인물 등인 경우 반드시 빈 배열 []을 반환하세요.
2. 조미료(소금, 간장, 고추장 등)가 아닌 주재료/부재료(예: 두부, 계란, 양파, 대파, 버섯, 당근, 돼지고기, 김치 등)의 이름을 한국어로 간결하게 추출하세요.
3. 중복 없이 단어 단위로 추출하세요. (예: ["계란", "두부", "대파"])
4. 출력은 반드시 다음과 같은 JSON 형식이어야 합니다:
{
  "isRecognized": true,
  "ingredients": ["재료1", "재료2"]
}
만약 식재료를 식별할 수 없다면:
{
  "isRecognized": false,
  "ingredients": []
}
`

    const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z]+;base64,/, "")

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    })

    const text = response.text?.trim() || "{}"
    let rawObj: unknown = {}
    try {
      rawObj = JSON.parse(text)
    } catch {
      rawObj = {}
    }

    const parsed = GeminiVisionRawOutputSchema.parse(rawObj)
    const ingredients = parsed.ingredients
      .map((i) => i.trim())
      .filter((i) => i.length > 0)

    const isRecognized = Boolean(parsed.isRecognized && ingredients.length > 0)

    return {
      ingredients,
      isRecognized,
    }
  } catch (error) {
    console.error("[Gemini Vision Error]", error)
    return {
      ingredients: [],
      isRecognized: false,
    }
  }
}

/**
 * 인식된 식재료와 보유 조미료를 바탕으로 1~3개의 레시피를 생성하고 없는 재료를 마킹합니다.
 */
export async function generateRecipesWithGemini(
  ingredients: string[],
  seasonings: string[],
  dietMode: DietMode = "일반",
): Promise<Recipe[]> {
  const ai = getGeminiClient()

  // API Key가 없거나 오류 시 지능형 fallback 레시피 제공 (사용자 재료에 맞춰 missing 플래그 동적 계산)
  if (!ai) {
    console.warn("[Gemini] Using fallback recipe generator based on provided ingredients and seasonings.")
    return computeMissingIngredients(FALLBACK_RECIPES, ingredients, seasonings)
  }

  try {
    const dietInstruction =
      dietMode === "다이어트"
        ? "[식단 목표] 사용자는 다이어트 중입니다. 500kcal 이하의 저칼로리 레시피를 우선 추천하고, 칼로리를 최소화하는 조리법을 선택하세요."
        : dietMode === "고단백"
        ? "[식단 목표] 사용자는 고단백 식단이 목표입니다. 닭가슴살·두부·계란·콩류 등 단백질이 높은 재료를 최대한 활용하고, 포만감이 높은 레시피를 추천하세요."
        : ""

    const prompt = `
당신은 자취생과 식단 관리자를 위한 전문 AI 요리사입니다.
사용자가 현재 보유하고 있는 식재료 및 조미료를 기반으로, 간편하게 만들 수 있는 현실적인 요리 레시피를 1~3개 추천해주세요.
${dietInstruction ? `
${dietInstruction}` : ""}

[사용자 보유 재료]
- 식재료: ${ingredients.join(", ") || "없음"}
- 조미료: ${seasonings.join(", ") || "없음"}

[레시피 생성 원칙]
1. 최소 1개, 최대 3개의 레시피를 제안하세요.
2. 가능한 한 사용자가 가진 식재료와 조미료를 최대한 활용하되, 요리의 완성을 위해 꼭 필요하다면 없는 재료도 레시피 재료 목록에 포함해도 됩니다.
3. 각 레시피마다:
   - title: 매력적인 요리명 (예: "초간단 애호박 두부조림")
   - tagline: 한 줄 설명 (예: "냉장고 파먹기 딱 좋은 10분 밥도둑")
   - difficulty: "쉬움" | "보통" | "도전" 중 하나
   - minutes: 조리 예상 소요시간(분) (숫자만, 예: 15)
   - kcal: 예상 칼로리(kcal) (숫자만, 예: 350)
   - ingredients: 재료 목록 배열 (각 항목은 {"name": "두부 1/2모"} 형태)
   - steps: 3~5단계의 명확하고 따라하기 쉬운 조리 순서 문자열 배열

[응답 JSON 스키마]
반드시 다음 구조의 JSON 배열 형식으로만 응답하세요:
[
  {
    "id": "recipe-1",
    "title": "요리명",
    "tagline": "한줄 설명",
    "difficulty": "쉬움",
    "minutes": 15,
    "kcal": 350,
    "ingredients": [
      { "name": "두부 1/2모" },
      { "name": "계란 2개" }
    ],
    "steps": [
      "1단계 설명",
      "2단계 설명"
    ]
  }
]
`

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    })

    const text = response.text?.trim() || "[]"
    const parsed: unknown = JSON.parse(text)

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return computeMissingIngredients(FALLBACK_RECIPES, ingredients, seasonings)
    }

    const recipes: Recipe[] = parsed.slice(0, 3).map((r, index) => {
      const difficulty: "쉬움" | "보통" | "도전" =
        r.difficulty === "쉬움" || r.difficulty === "보통" || r.difficulty === "도전"
          ? r.difficulty
          : "보통"

      const rawIngredients = Array.isArray(r.ingredients) ? r.ingredients : []
      const rawSteps = Array.isArray(r.steps) ? r.steps : []

      return {
        id: typeof r.id === "string" ? r.id : `generated-recipe-${index + 1}`,
        title: typeof r.title === "string" ? r.title : "맞춤 요리",
        tagline: typeof r.tagline === "string" ? r.tagline : "맛있는 한 끼",
        difficulty,
        minutes: typeof r.minutes === "number" && r.minutes > 0 ? r.minutes : 15,
        kcal: typeof r.kcal === "number" && r.kcal > 0 ? r.kcal : 350,
        ingredients: rawIngredients.map((item: { name?: string }) => ({
          name: typeof item?.name === "string" ? item.name : String(item || ""),
        })),
        steps: rawSteps.map((step: unknown) => String(step)),
      }
    })

    return computeMissingIngredients(recipes, ingredients, seasonings)
  } catch (error) {
    console.error("[Gemini Recipe Generation Error]", error)
    return computeMissingIngredients(FALLBACK_RECIPES, ingredients, seasonings)
  }
}

/**
 * 사용자가 가진 식재료와 조미료 목록을 대조하여 부족한 재료에 missing: true를 부여합니다.
 */
export function computeMissingIngredients(
  recipes: Recipe[],
  userIngredients: string[],
  userSeasonings: string[],
): Recipe[] {
  const availableItems = new Set([
    ...userIngredients.map((s) => s.trim().toLowerCase()),
    ...userSeasonings.map((s) => s.trim().toLowerCase()),
    "물", "생수", "식수", "찬물", "뜨거운 물", "온수" // 기본 식수 제외
  ])

  return recipes.map((recipe) => {
    const updatedIngredients = recipe.ingredients.map((ing) => {
      const ingNameLower = ing.name.toLowerCase()
      // 재료 이름에 사용자가 가진 식재료나 조미료의 키워드가 포함되어 있는지 검사
      const isAvailable = Array.from(availableItems).some((avail) => {
        if (!avail) return false
        return ingNameLower.includes(avail)
      })

      return {
        name: ing.name,
        missing: !isAvailable,
      }
    })

    return {
      ...recipe,
      ingredients: updatedIngredients,
    }
  })
}
