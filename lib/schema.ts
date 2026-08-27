import { z } from "zod"

export const SEASONINGS_LIST = [
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

export type SeasoningName = (typeof SEASONINGS_LIST)[number]

export const DIET_MODES = ["일반", "다이어트", "고단백"] as const
export type DietMode = (typeof DIET_MODES)[number]

export const RecognizedIngredientSchema = z.object({
  name: z.string().min(1, "재료명이 비어있을 수 없습니다"),
  confidence: z.number().optional(),
  category: z.string().optional(),
})

export const VisionRecognitionResponseSchema = z.object({
  success: z.boolean(),
  ingredients: z.array(z.string()),
  isRecognized: z.boolean(),
  errorCode: z.enum(["RECOGNITION_FAILED", "INVALID_IMAGE", "SERVER_ERROR"]).optional(),
  message: z.string().optional(),
})

export const GeminiVisionRawOutputSchema = z.object({
  isRecognized: z.boolean().catch(false),
  ingredients: z.array(z.string()).catch([]),
})

export type VisionRecognitionResponse = z.infer<typeof VisionRecognitionResponseSchema>

export const IngredientItemSchema = z.object({
  name: z.string(),
  missing: z.boolean().optional(),
})

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  difficulty: z.enum(["쉬움", "보통", "도전"]),
  minutes: z.number().int().positive(),
  kcal: z.number().int().positive(),
  ingredients: z.array(IngredientItemSchema),
  steps: z.array(z.string().min(1)),
})

export type Recipe = z.infer<typeof RecipeSchema>
export type Ingredient = z.infer<typeof IngredientItemSchema>

export const RecipeRecommendRequestSchema = z.object({
  ingredients: z.array(z.string()).min(1, "식재료가 최소 1개 이상 인식되어야 합니다"),
  seasonings: z.array(z.string()),
  dietMode: z.enum(DIET_MODES).optional().default("일반"),
})

export type RecipeRecommendRequest = z.infer<typeof RecipeRecommendRequestSchema>

export const RecipeRecommendResponseSchema = z.object({
  success: z.boolean(),
  recipes: z.array(RecipeSchema),
  errorCode: z.enum(["GENERATION_FAILED", "TIMEOUT", "SERVER_ERROR"]).optional(),
  message: z.string().optional(),
})

export type RecipeRecommendResponse = z.infer<typeof RecipeRecommendResponseSchema>
