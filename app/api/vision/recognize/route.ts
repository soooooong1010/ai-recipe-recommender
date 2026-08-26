import { NextRequest, NextResponse } from "next/server"
import { extractIngredientsWithVision } from "@/lib/gemini"
import { VisionRecognitionResponse } from "@/lib/schema"

export async function POST(req: NextRequest) {
  try {
    let body
    try {
      body = await req.json()
    } catch {
      const errorRes: VisionRecognitionResponse = {
        success: false,
        isRecognized: false,
        ingredients: [],
        errorCode: "INVALID_IMAGE",
        message: "유효하지 않은 요청 본문(JSON)입니다.",
      }
      return NextResponse.json(errorRes, { status: 400 })
    }

    const { image, mimeType = "image/jpeg", simulateFailure = false } = body || {}

    if (!image || typeof image !== "string") {
      const errorRes: VisionRecognitionResponse = {
        success: false,
        isRecognized: false,
        ingredients: [],
        errorCode: "INVALID_IMAGE",
        message: "유효한 이미지 데이터가 전달되지 않았습니다.",
      }
      return NextResponse.json(errorRes, { status: 400 })
    }

    if (simulateFailure) {
      const failedRes: VisionRecognitionResponse = {
        success: false,
        isRecognized: false,
        ingredients: [],
        errorCode: "RECOGNITION_FAILED",
        message: "사진 인식에 실패했습니다. 재촬영이 필요합니다.",
      }
      return NextResponse.json(failedRes, { status: 200 })
    }

    const { ingredients, isRecognized } = await extractIngredientsWithVision(image, mimeType)

    if (!isRecognized || ingredients.length === 0) {
      const failedRes: VisionRecognitionResponse = {
        success: false,
        isRecognized: false,
        ingredients: [],
        errorCode: "RECOGNITION_FAILED",
        message: "사진에서 식재료를 식별할 수 없습니다. 재촬영 후 다시 시도해주세요.",
      }
      return NextResponse.json(failedRes, { status: 200 })
    }

    const successRes: VisionRecognitionResponse = {
      success: true,
      isRecognized: true,
      ingredients,
      message: `식재료 ${ingredients.length}개 인식 완료`,
    }

    return NextResponse.json(successRes, { status: 200 })
  } catch (error) {
    console.error("[Vision API Error]", error)
    const serverErrorRes: VisionRecognitionResponse = {
      success: false,
      isRecognized: false,
      ingredients: [],
      errorCode: "SERVER_ERROR",
      message: "식재료 분석 중 서버 오류가 발생했습니다.",
    }
    return NextResponse.json(serverErrorRes, { status: 500 })
  }
}
