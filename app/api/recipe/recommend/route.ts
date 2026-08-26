import { NextRequest, NextResponse } from "next/server"
import { generateRecipesWithGemini } from "@/lib/gemini"
import { RecipeRecommendResponse } from "@/lib/schema"

export async function POST(req: NextRequest) {
  try {
    let body
    try {
      body = await req.json()
    } catch {
      const errorRes: RecipeRecommendResponse = {
        success: false,
        recipes: [],
        errorCode: "SERVER_ERROR",
        message: "유효하지 않은 요청 본문(JSON)입니다.",
      }
      return NextResponse.json(errorRes, { status: 400 })
    }

    const {
      ingredients = [],
      seasonings = [],
      simulateDelay = false,
      simulateError = false,
    } = body || {}

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      const errorRes: RecipeRecommendResponse = {
        success: false,
        recipes: [],
        errorCode: "GENERATION_FAILED",
        message: "식재료가 최소 1개 이상 필요합니다.",
      }
      return NextResponse.json(errorRes, { status: 400 })
    }

    if (simulateError) {
      const errorRes: RecipeRecommendResponse = {
        success: false,
        recipes: [],
        errorCode: "SERVER_ERROR",
        message: "레시피를 불러오지 못했습니다. 다시 시도해주세요",
      }
      return NextResponse.json(errorRes, { status: 500 })
    }

    if (simulateDelay) {
      // 4초 지연 시뮬레이션
      await new Promise((res) => setTimeout(res, 4000))
    }

    const recipes = await generateRecipesWithGemini(ingredients, seasonings)

    const successRes: RecipeRecommendResponse = {
      success: true,
      recipes,
      message: `맞춤 레시피 ${recipes.length}개 생성 완료`,
    }

    return NextResponse.json(successRes, { status: 200 })
  } catch (error) {
    console.error("[Recipe Recommend API Error]", error)
    const serverErrorRes: RecipeRecommendResponse = {
      success: false,
      recipes: [],
      errorCode: "SERVER_ERROR",
      message: "레시피를 불러오는 중 오류가 발생했습니다.",
    }
    return NextResponse.json(serverErrorRes, { status: 500 })
  }
}
