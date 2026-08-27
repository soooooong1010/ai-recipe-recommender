import { Camera, ChefHat, Sparkles, Utensils } from "lucide-react"
import Link from "next/link"

const STEPS = [
  {
    icon: Camera,
    tone: "primary" as const,
    number: "01",
    title: "식재료 스캔",
    desc: "사진 한 장으로 냉장고 속 재료를 즉시 인식합니다.",
  },
  {
    icon: Utensils,
    tone: "accent" as const,
    number: "02",
    title: "조미료 선택",
    desc: "집에 있는 기본 양념을 선택하여 더 정확한 레시피를 받으세요.",
  },
  {
    icon: ChefHat,
    tone: "primary" as const,
    number: "03",
    title: "맞춤 레시피",
    desc: "난이도, 소요 시간, 칼로리까지 고려한 최적의 레시피를 제안합니다.",
  },
]

const VALUES = [
  "화면 이동 없는 원페이지 경험",
  "부족한 재료는 빨간색으로 바로 표시",
  "응답 지연·실패에도 끊김 없는 화면",
]

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col pb-[100px]">
      <header className="sticky top-0 z-40 flex w-full items-center justify-center bg-background/95 px-4 py-3 backdrop-blur-sm">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ChefHat className="size-5" aria-hidden="true" />
          냉털 레시피
        </span>
      </header>

      <main className="flex-grow">
        <section className="relative flex h-[50vh] min-h-[400px] w-full items-end px-4 pb-8 md:px-10">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="/images/fridge-ingredients.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-2xl md:mx-0">
            <h1 className="mb-2 text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
              냉장고 속 남은 재료,
              <br />
              AI가 찾아주는 <span className="text-primary">특별한 레시피</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
              사진 한 장으로 오늘 뭐 먹을지 고민을 해결하세요. 지금 바로 시작하세요.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-8 md:px-10">
          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="absolute top-8 right-[16%] left-[16%] hidden h-0.5 bg-border md:block" />
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="relative z-10 flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center shadow-sm md:items-start md:text-left"
              >
                <span
                  aria-hidden="true"
                  className={
                    step.tone === "primary"
                      ? "flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"
                      : "flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent"
                  }
                >
                  <step.icon className="size-6" aria-hidden="true" />
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      step.tone === "primary"
                        ? "text-sm font-bold text-primary"
                        : "text-sm font-bold text-accent"
                    }
                  >
                    {step.number}
                  </span>
                  <h3 className="text-base font-semibold">{step.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto my-2 max-w-4xl rounded-xl bg-card px-4 py-6 md:px-10">
          <ul className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-8">
            {VALUES.map((v) => (
              <li key={v} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {v}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <div className="fixed bottom-0 z-50 w-full bg-gradient-to-t from-background from-60% to-transparent px-4 pt-8 pb-4 md:px-10">
        <div className="mx-auto max-w-md">
          <Link
            href="/start"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-105 active:scale-95"
          >
            <Camera className="size-5" aria-hidden="true" />
            지금 바로 스캔하기
          </Link>
        </div>
      </div>
    </div>
  )
}
