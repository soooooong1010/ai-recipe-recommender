"use client"

import { DIET_MODES, type DietMode } from "@/lib/schema"
import { cn } from "@/lib/utils"

const MODE_META: Record<DietMode, { emoji: string; desc: string }> = {
  일반: { emoji: "🍽️", desc: "균형 잡힌 한 끼" },
  다이어트: { emoji: "🥗", desc: "저칼로리 식단 목표" },
  고단백: { emoji: "💪", desc: "근육 & 포만감 중시" },
}

type Props = {
  selected: DietMode
  onSelect: (mode: DietMode) => void
}

export function DietModePicker({ selected, onSelect }: Props) {
  return (
    <section aria-labelledby="diet-mode-heading" className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <h2 id="diet-mode-heading" className="font-serif text-lg font-bold">
          3. 식단 목표
        </h2>
        <span className="text-xs text-muted-foreground">레시피 방향을 설정해요</span>
      </div>

      <div
        role="radiogroup"
        aria-label="식단 목표 선택"
        className="grid grid-cols-3 gap-2"
      >
        {DIET_MODES.map((mode) => {
          const { emoji, desc } = MODE_META[mode]
          const isSelected = selected === mode
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(mode)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-3.5 text-center transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              <span className="text-2xl" aria-hidden="true">{emoji}</span>
              <span className="text-sm font-semibold leading-none">{mode}</span>
              <span className="text-[0.65rem] leading-snug opacity-80">{desc}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
