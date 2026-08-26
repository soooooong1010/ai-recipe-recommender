"use client"

import { Check } from "lucide-react"
import { SEASONINGS } from "@/lib/recipe-data"
import { cn } from "@/lib/utils"

type Props = {
  selected: string[]
  onToggle: (name: string) => void
  highlight: boolean
}

export function SeasoningPicker({ selected, onToggle, highlight }: Props) {
  return (
    <section aria-labelledby="seasoning-heading" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="seasoning-heading" className="font-serif text-lg font-bold">
          2. 가지고 있는 조미료
        </h2>
        <span className="text-xs text-muted-foreground">{selected.length}개 선택</span>
      </div>

      <p
        className={cn(
          "text-sm transition-colors duration-300",
          highlight ? "font-bold text-destructive" : "text-muted-foreground",
        )}
      >
        조미료를 클릭해주세요
      </p>

      <div
        className={cn(
          "flex flex-wrap gap-2 rounded-2xl transition-all duration-300",
          highlight && "animate-shake ring-2 ring-destructive/60 ring-offset-4 ring-offset-background",
        )}
      >
        {SEASONINGS.map((name) => {
          const active = selected.includes(name)
          return (
            <button
              key={name}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(name)}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-all duration-200 active:scale-95",
                active
                  ? "border-accent bg-accent text-accent-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground",
              )}
            >
              {active && <Check className="size-3.5" />}
              {name}
            </button>
          )
        })}
      </div>
    </section>
  )
}
