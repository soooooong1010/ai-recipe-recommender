export const SEASONINGS = [
  "소금",
  "후추",
  "간장",
  "고추장",
  "고춧가루",
  "설탕",
  "식용유",
  "참기름",
  "마늘",
  "케첩",
  "마요네즈",
  "굴소스",
] as const

export type Ingredient = {
  name: string
  /** 사용자가 보유하지 않은 재료 → 빨간색 강조 */
  missing?: boolean
}

export type Recipe = {
  id: string
  title: string
  tagline: string
  difficulty: "쉬움" | "보통" | "도전"
  minutes: number
  kcal: number
  ingredients: Ingredient[]
  steps: string[]
}

export const RECIPES: Recipe[] = [
  {
    id: "tofu-jjigae",
    title: "자취생 두부 계란탕",
    tagline: "냉장고 문 한 번만 열면 끝나는 국물 요리",
    difficulty: "쉬움",
    minutes: 15,
    kcal: 320,
    ingredients: [
      { name: "두부 1/2모" },
      { name: "계란 2개" },
      { name: "대파 1/2대" },
      { name: "간장 1큰술" },
      { name: "다진 마늘 1/2큰술" },
      { name: "멸치 다시팩", missing: true },
    ],
    steps: [
      "냄비에 물 500ml를 붓고 다시팩을 넣어 5분간 끓여 국물을 냅니다.",
      "두부를 한입 크기로 썰어 넣고 간장, 다진 마늘로 간을 맞춥니다.",
      "계란을 풀어 원을 그리듯 천천히 흘려 넣습니다.",
      "대파를 올리고 후추를 톡톡 뿌려 마무리합니다.",
    ],
  },
  {
    id: "zucchini-jeon",
    title: "애호박 치즈전",
    tagline: "겉은 바삭, 속은 쫙 늘어나는 야식 담당",
    difficulty: "보통",
    minutes: 20,
    kcal: 410,
    ingredients: [
      { name: "애호박 1/2개" },
      { name: "슈레드 치즈 한 줌" },
      { name: "계란 1개" },
      { name: "소금 약간" },
      { name: "식용유 2큰술" },
      { name: "부침가루 3큰술", missing: true },
      { name: "쪽파", missing: true },
    ],
    steps: [
      "애호박을 얇게 채 썰어 소금을 살짝 뿌리고 5분간 절입니다.",
      "물기를 짜고 계란, 부침가루를 넣어 반죽처럼 섞습니다.",
      "달군 팬에 식용유를 넉넉히 두르고 반죽을 얇게 펼칩니다.",
      "한쪽 면이 익으면 치즈를 올리고 반으로 접어 노릇하게 굽습니다.",
    ],
  },
  {
    id: "mushroom-bokkeumbap",
    title: "버섯 간장 볶음밥",
    tagline: "한 팬으로 끝, 설거지 최소화 레시피",
    difficulty: "쉬움",
    minutes: 12,
    kcal: 520,
    ingredients: [
      { name: "찬밥 1공기" },
      { name: "양파 1/4개" },
      { name: "버섯 3개" },
      { name: "당근 조금" },
      { name: "간장 1.5큰술" },
      { name: "참기름 1작은술" },
      { name: "버터 한 조각", missing: true },
    ],
    steps: [
      "양파, 버섯, 당근을 잘게 다져 팬에 볶습니다.",
      "버터를 넣어 향을 낸 뒤 찬밥을 넣고 눌러가며 볶습니다.",
      "팬 가장자리에 간장을 둘러 불향을 입힙니다.",
      "불을 끄고 참기름을 두르고 후추로 마무리합니다.",
    ],
  },
]
