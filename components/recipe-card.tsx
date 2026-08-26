import { ChefHat, Clock, Flame } from "lucide-react"
import type { Recipe } from "@/lib/recipe-data"
import { cn } from "@/lib/utils"

export function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const missingCount = recipe.ingredients.filter((i) => i.missing).length

  return (
    <article
      className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 duration-500"
      style={{ animationDelay: `${index * 120}ms`, animationFillMode: "backwards" }}
    >
      <header className="flex flex-col gap-3">
        <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ChefHat className="size-4 text-primary" aria-hidden="true" />
            <dt className="sr-only">난이도</dt>
            <dd>{recipe.difficulty}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-4 text-primary" aria-hidden="true" />
            <dt className="sr-only">소요시간</dt>
            <dd>{recipe.minutes}분</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="size-4 text-primary" aria-hidden="true" />
            <dt className="sr-only">칼로리</dt>
            <dd>{recipe.kcal}kcal</dd>
          </div>
        </dl>

        <div>
          <h3 className="font-serif text-xl font-bold text-balance">{recipe.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">{recipe.tagline}</p>
        </div>
      </header>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">재료</h4>
          {missingCount > 0 && (
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[0.7rem] text-destructive">
              부족한 재료 {missingCount}개
            </span>
          )}
        </div>
        <ul className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
          {recipe.ingredients.map((ing, i) => (
            <li key={ing.name} className="flex items-center gap-2">
              <span className={cn(ing.missing ? "font-bold text-destructive" : "text-foreground")}>
                {ing.name}
              </span>
              {i < recipe.ingredients.length - 1 && (
                <span aria-hidden="true" className="text-border">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <h4 className="text-sm font-medium">조리 순서</h4>
        <ol className="flex flex-col gap-3">
          {recipe.steps.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-pretty">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  )
}
