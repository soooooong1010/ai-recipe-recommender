"use client"

import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

export type Outcome = "success" | "slow" | "error"

const OUTCOMES: { value: Outcome; label: string }[] = [
  { value: "success", label: "정상 추천" },
  { value: "slow", label: "응답 지연" },
  { value: "error", label: "응답 실패" },
]

type Props = {
  outcome: Outcome
  onOutcomeChange: (o: Outcome) => void
  recognitionFailed: boolean
  onRecognitionFailedChange: (v: boolean) => void
}

export function ScenarioBar({
  outcome,
  onOutcomeChange,
  recognitionFailed,
  onRecognitionFailedChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-4">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info className="size-3.5" aria-hidden="true" />
        프로토타입 시나리오 스위치 — 각 상태를 눌러서 확인해보세요
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <div
          role="radiogroup"
          aria-label="AI 응답 시나리오"
          className="flex rounded-full bg-card p-1 ring-1 ring-border"
        >
          {OUTCOMES.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={outcome === o.value}
              onClick={() => onOutcomeChange(o.value)}
              className={cn(
                "h-7 rounded-full px-3 text-xs transition-all duration-200",
                outcome === o.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-pressed={recognitionFailed}
          onClick={() => onRecognitionFailedChange(!recognitionFailed)}
          className={cn(
            "h-9 rounded-full border px-3.5 text-xs transition-all duration-200",
            recognitionFailed
              ? "border-destructive bg-destructive/10 font-bold text-destructive"
              : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          사진 인식 실패 {recognitionFailed ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  )
}
