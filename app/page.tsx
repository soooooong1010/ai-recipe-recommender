"use client"

import { useEffect, useRef, useState } from "react"
import { LoaderCircle, RotateCcw, Sparkles, TriangleAlert, Utensils } from "lucide-react"
import { PhotoDropzone } from "@/components/photo-dropzone"
import { RecipeCard } from "@/components/recipe-card"
import { ScenarioBar, type Outcome } from "@/components/scenario-bar"
import { SeasoningPicker } from "@/components/seasoning-picker"
import { RECIPES } from "@/lib/recipe-data"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "success" | "error"

export default function Page() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [seasonings, setSeasonings] = useState<string[]>([])
  const [recognitionFailed, setRecognitionFailed] = useState(false)
  const [outcome, setOutcome] = useState<Outcome>("success")

  const [status, setStatus] = useState<Status>("idle")
  const [delayed, setDelayed] = useState(false)
  const [photoWarning, setPhotoWarning] = useState(false)
  const [seasoningWarning, setSeasoningWarning] = useState(false)

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (status === "success" || status === "error") {
      const t = setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80,
      )
      return () => clearTimeout(t)
    }
  }, [status])

  const photoBlocked = !photo || recognitionFailed
  const disabled = status === "loading" || recognitionFailed

  function toggleSeasoning(name: string) {
    setSeasoningWarning(false)
    setSeasonings((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    )
  }

  function run() {
    if (status === "loading" || recognitionFailed) return

    let invalid = false
    if (!photo) {
      setPhotoWarning(false)
      requestAnimationFrame(() => setPhotoWarning(true))
      invalid = true
    }
    if (seasonings.length === 0) {
      setSeasoningWarning(false)
      requestAnimationFrame(() => setSeasoningWarning(true))
      invalid = true
    }
    if (invalid) {
      timers.current.push(
        setTimeout(() => {
          setPhotoWarning(false)
          setSeasoningWarning(false)
        }, 2600),
      )
      return
    }

    timers.current.forEach(clearTimeout)
    timers.current = []
    setStatus("loading")
    setDelayed(false)

    const wait = outcome === "slow" ? 6000 : 1800
    if (outcome === "slow") {
      timers.current.push(setTimeout(() => setDelayed(true), 2200))
    }
    timers.current.push(
      setTimeout(() => {
        setStatus(outcome === "error" ? "error" : "success")
        setDelayed(false)
      }, wait),
    )
  }

  function reset() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhoto(null)
    setSeasonings([])
    setRecognitionFailed(false)
    setStatus("idle")
    setDelayed(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 pt-10 pb-20 sm:px-6">
      <header className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Utensils className="size-3.5" aria-hidden="true" />
          자취생 냉장고 털기
        </span>
        <h1 className="font-serif text-3xl leading-tight font-bold text-balance sm:text-4xl">
          사진 한 장이면
          <br />
          오늘 저녁 정해드려요
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          냉장고 안을 찍고 가진 조미료만 골라주세요. 지금 있는 재료로 만들 수 있는 레시피를 골라
          드릴게요.
        </p>
      </header>

      <ScenarioBar
        outcome={outcome}
        onOutcomeChange={setOutcome}
        recognitionFailed={recognitionFailed}
        onRecognitionFailedChange={(v) => {
          setRecognitionFailed(v)
          if (v) {
            timers.current.forEach(clearTimeout)
            timers.current = []
            setStatus("idle")
            setDelayed(false)
            if (!photo) setPhoto("/images/fridge-ingredients.png")
          }
        }}
      />

      <PhotoDropzone
        photo={photo}
        onPhotoChange={(p) => {
          setPhoto(p)
          setPhotoWarning(false)
          if (p) setRecognitionFailed(false)
        }}
        recognitionFailed={recognitionFailed}
        highlight={photoWarning}
      />

      <SeasoningPicker
        selected={seasonings}
        onToggle={toggleSeasoning}
        highlight={seasoningWarning}
      />

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={run}
          disabled={disabled}
          aria-busy={status === "loading"}
          className={cn(
            "inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-medium text-primary-foreground transition-all duration-300",
            "hover:brightness-105 active:scale-[0.98]",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:active:scale-100",
          )}
        >
          {status === "loading" ? (
            <>
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
              레시피 고르는 중...
            </>
          ) : (
            <>
              <Sparkles className="size-5" aria-hidden="true" />
              레시피 추천받기
            </>
          )}
        </button>
        {recognitionFailed ? (
          <p className="text-center text-xs text-destructive">
            사진 인식 실패로 추천을 진행할 수 없어요. 재촬영 후 다시 시도해주세요.
          </p>
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            {photoBlocked || seasonings.length === 0
              ? "사진과 조미료를 모두 준비하면 더 정확해져요"
              : `재료 8개 · 조미료 ${seasonings.length}개로 추천할게요`}
          </p>
        )}
      </div>

      <div ref={resultRef} className="scroll-mt-6">
        {status === "loading" && <LoadingResult delayed={delayed} />}

        {status === "error" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 flex flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center duration-500">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            >
              <TriangleAlert className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-destructive">
                레시피를 불러오지 못했습니다. 다시 시도해주세요
              </p>
              <p className="text-xs text-muted-foreground">
                첨부한 사진과 선택한 조미료 {seasonings.length}개는 그대로 유지했어요.
              </p>
            </div>
            <button
              type="button"
              onClick={run}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform active:scale-95"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              다시 시도
            </button>
          </div>
        )}

        {status === "success" && (
          <section aria-labelledby="result-heading" className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 id="result-heading" className="font-serif text-lg font-bold">
                오늘의 추천 {RECIPES.length}가지
              </h2>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                처음부터 다시
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-bold text-destructive">빨간 재료</span>는 지금 없는 재료예요.
              장 볼 때 챙겨주세요.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {RECIPES.map((r, i) => (
                <RecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function LoadingResult({ delayed }: { delayed: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-in fade-in flex flex-col gap-4 duration-500"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle className="size-4 animate-spin text-primary" aria-hidden="true" />
        재료를 살펴보고 있어요...
      </div>

      {delayed && (
        <p className="animate-in fade-in slide-in-from-top-1 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary duration-500">
          응답이 지연되고 있습니다. 잠시만 기다려주세요
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex animate-pulse flex-col gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex gap-3">
              <div className="h-3 w-14 rounded-full bg-muted" />
              <div className="h-3 w-12 rounded-full bg-muted" />
              <div className="h-3 w-16 rounded-full bg-muted" />
            </div>
            <div className="h-6 w-2/3 rounded-lg bg-muted" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-full rounded-full bg-muted" />
              <div className="h-3 w-5/6 rounded-full bg-muted" />
              <div className="h-3 w-4/6 rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
