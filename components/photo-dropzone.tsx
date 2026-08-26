"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Camera, ImageUp, TriangleAlert, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  photo: string | null
  onPhotoChange: (photo: string | null) => void
  recognitionFailed: boolean
  highlight: boolean
}

const SAMPLE_PHOTO = "/images/fridge-ingredients.png"

export function PhotoDropzone({ photo, onPhotoChange, recognitionFailed, highlight }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function readFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () => onPhotoChange(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <section aria-labelledby="photo-heading" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="photo-heading" className="font-serif text-lg font-bold">
          1. 냉장고 사진
        </h2>
        {photo && !recognitionFailed && (
          <span className="text-xs text-accent">재료 8개 인식 완료</span>
        )}
      </div>

      {!photo ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            readFile(e.dataTransfer.files?.[0])
          }}
          className={cn(
            "relative flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-card px-6 py-10 text-center transition-all duration-300",
            dragging && "border-primary bg-primary/5",
            highlight && "animate-shake border-destructive bg-destructive/5",
          )}
        >
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors",
              highlight && "bg-destructive/15 text-destructive",
            )}
            aria-hidden="true"
          >
            <Camera className="size-7" />
          </span>
          <div className="flex flex-col gap-1">
            <p
              className={cn(
                "text-base font-medium transition-colors",
                highlight ? "text-destructive" : "text-foreground",
              )}
            >
              식재료 사진을 찍으세요
            </p>
            <p className="text-sm text-muted-foreground text-pretty">
              냉장고 문 열고 한 장만 찍어주세요. 드래그해서 올려도 돼요.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
            >
              <ImageUp className="size-4" />
              사진 첨부하기
            </button>
            <button
              type="button"
              onClick={() => onPhotoChange(SAMPLE_PHOTO)}
              className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              예시 사진 쓰기
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => readFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={photo || "/placeholder.svg"}
                alt="첨부한 냉장고 식재료 사진 미리보기"
                fill
                sizes="96px"
                className={cn(
                  "object-cover transition-all duration-500",
                  recognitionFailed && "grayscale",
                )}
                unoptimized
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">fridge_today.jpg</p>
                  {recognitionFailed ? (
                    <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                      <TriangleAlert className="size-3.5" />
                      재료를 알아볼 수 없어요
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">
                      계란 · 두부 · 애호박 · 버섯 · 당근 · 양파 · 대파 · 치즈
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onPhotoChange(null)}
                  aria-label="사진 삭제"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              {recognitionFailed && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="animate-in fade-in slide-in-from-bottom-1 inline-flex h-8 w-fit items-center gap-1.5 rounded-full bg-destructive/10 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                >
                  <Camera className="size-3.5" />
                  재촬영
                </button>
              )}
            </div>
          </div>

          {recognitionFailed && (
            <p className="animate-in fade-in text-sm text-destructive">
              사진 인식에 실패했어요. <span className="font-bold">재촬영</span>이 필요합니다.
            </p>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => readFile(e.target.files?.[0])}
          />
        </div>
      )}
    </section>
  )
}
