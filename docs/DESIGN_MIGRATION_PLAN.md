# Culinary Intelligence 디자인 시스템 마이그레이션 계획

본 문서는 루트의 [`design.md`](../design.md)(Culinary Intelligence Design System)를 기준으로,
현재 서비스의 톤앤매너를 전면 재정비하기 위한 실행 계획입니다.

---

## 1. design.md 핵심 요약

| 항목 | 목표 값 |
|---|---|
| Primary Color | `#ff7a00` (Vibrant Carrot Orange) |
| Background | `#f9f9f9` (뉴트럴 그레이) |
| Container | `#ffffff` |
| Typography | Inter (Sans-serif) — Headline: Bold / Body: Regular |
| Shape | Rounded-md 8px — 모든 카드·버튼·입력 요소 공통 |
| CTA 버튼 | 텍스트+아이콘 결합, 풀 너비(Full-width) |
| Step Cards | 번호 + 일러스트/아이콘 결합 |
| Review Section | 별점 + 텍스트(소셜 프루프) |
| Icons | 미니멀 라인 아이콘 또는 부드러운 컬러 배경의 서클 아이콘 |
| Images | 밝고 자연광 있는 고품질 주방/재료 사진 |

---

## 2. 현재 상태 vs 목표 상태 갭 분석

| 항목 | 현재 (`app/globals.css`, `app/layout.tsx`) | 목표 (design.md) | 변경 난이도 |
|---|---|---|---|
| Primary | `oklch(0.68 0.18 45)` — 톤은 오렌지 계열이나 채도/명도 다름 | `#ff7a00` | 낮음 (토큰 값 교체) |
| Background | `oklch(0.985 0.012 85)` — 따뜻한 아이보리 톤 | `#f9f9f9` 뉴트럴 그레이 | 낮음 |
| Card/Container | `oklch(1 0 0)` = `#ffffff` | `#ffffff` | 변경 불필요 (일치) |
| Font | `Gowun Dodum`(sans) / `Gowun Batang`(serif) — 손글씨 느낌의 한글 전용 폰트 | `Inter` | **높음** — Inter는 한글 미지원, 한글 폴백 폰트 결정 필요 |
| Radius | base `0.875rem`(14px), 헤더 뱃지·버튼은 `rounded-full` | 균일 `8px` | 중간 — 라운드 스케일 전체 재조정 + `rounded-full` 사용처 재검토 |
| CTA 버튼 | 이미 풀너비 + 아이콘 결합 (`app/page.tsx`) | 동일 패턴 | 낮음 (라운드만 조정) |
| Step Cards | 번호 원형 배지 사용 중 (`recipe-card.tsx`) | 번호+아이콘/일러스트 | 낮음~중간 |
| Review Section | **현재 앱에 리뷰/별점 기능 자체가 없음** | 별점+텍스트 | 범위 밖 — PRD에 없는 기능이라 이번 마이그레이션에서 제외 |
| Icons | `lucide-react` 라인 아이콘 사용 중 | 라인 아이콘 or 서클 배경 아이콘 | 낮음 (배경 서클 패턴 부분 적용) |
| Dark mode | 현재 완비된 다크 팔레트 존재 | design.md에 다크모드 언급 없음 (라이트 기준만 제공) | 중간 — 라이트 팔레트에서 다크 팔레트 비율 재도출 필요 |

**결론**: 컬러/라운드는 토큰 교체 수준이지만, **타이포그래피 전환(한글 지원 문제)** 이 이번 작업의 핵심 리스크입니다.

---

## 3. 확인이 필요한 의사결정 (권고안 포함)

| 이슈 | 권고안 | 사유 |
|---|---|---|
| Inter는 한글 미지원 | 라틴/숫자는 `Inter`, 한글은 `Pretendard`(오픈소스, Inter와 스타일 유사한 기하학적 산세리프)를 폴백으로 병행 적용 | design.md 취지(Clean & Minimal, 높은 가독성)에 부합하면서 한글 렌더링 문제 해결 |
| 기존 `font-serif`(Gowun Batang) 헤드라인 유지 여부 | 폐기하고 Inter Bold(한글은 Pretendard Bold)로 통일 | design.md가 Headline도 Inter 기준으로 명시, 별도 serif 언급 없음 |
| 다크모드 팔레트 | 라이트 토큰 비율을 유지한 채 다크 버전 재계산해서 유지 | design.md가 다크모드를 다루지 않지만, 기존 서비스가 다크모드를 지원하므로 제거보다 톤만 맞추는 것이 안전 |
| Review Section 컴포넌트 신규 제작 | **이번 범위에서 제외** | 현재 PRD/서비스에 리뷰·별점 기능이 없음. 없는 기능을 위한 컴포넌트를 미리 만들지 않음(범위 외 작업 방지) |

---

## 4. 단계별 실행 계획 (Design Sprint)

### 🎨 Design Sprint 1: 디자인 토�큰 교체
> 대상 파일: `app/globals.css`, `app/layout.tsx`

- [ ] 1.1 `--primary`를 `#ff7a00` 기준 oklch로 정밀 변환하여 라이트/다크 모두 반영
- [ ] 1.2 `--background`를 `#f9f9f9` 기준 뉴트럴 그레이로 교체 (라이트), 다크는 비율 유지하여 재계산
- [ ] 1.3 `--radius` base를 `0.5rem`(8px)로 축소, `--radius-sm~4xl` 스케일 재조정
- [ ] 1.4 `next/font/google`에서 `Inter` 도입 + `Pretendard`(한글) 폴백 스택 구성, `Gowun_Dodum`/`Gowun_Batang` import 제거
- [ ] 1.5 `--font-sans`/`--font-serif` 토큰을 Inter 기준으로 재정의 (serif 별도 폰트 제거, 필요 시 sans로 통합)

### 🧩 Design Sprint 2: 컴포넌트 패턴 정합화
> 대상 파일: `app/page.tsx`, `components/*.tsx`

- [ ] 2.1 `font-serif` 클래스 사용처 전수 조사 후 Inter 기반 헤드라인 스타일로 교체 (`page.tsx`, `recipe-card.tsx` 등)
- [ ] 2.2 `rounded-2xl`/`rounded-full` 등 개별 지정된 라운드 값을 8px 스케일(`rounded-md`) 기준으로 재검토·통일
- [ ] 2.3 CTA 버튼(추천받기, 다시 시도) 스타일을 신규 Primary/라운드 토큰에 맞춰 검증
- [ ] 2.4 `RecipeCard` 스텝 배지·아이콘 컬러/배경을 신규 팔레트로 조정
- [ ] 2.5 `PhotoDropzone`, `SeasoningPicker`, `DietModePicker`, `ScenarioBar` 카드/버튼 스타일 일괄 점검

### ✅ Design Sprint 3: 검증 및 문서화
- [ ] 3.1 라이트/다크 모드 전환 시 명도 대비(WCAG AA) 육안 점검
- [ ] 3.2 `npx tsc --noEmit`, `npx next build` 통과 확인
- [ ] 3.3 브라우저에서 실제 화면 확인 (`/run` 스킬 활용) — 데스크톱/모바일 반응형 포함
- [ ] 3.4 `docs/DEVELOPMENT_PLAN.md`에 Design Sprint 진행 내역 반영

---

## 5. 리스크 및 롤백 전략

- 디자인 토큰은 `app/globals.css` 한 곳에 집중되어 있어 영향 범위 파악이 쉬움 — 문제 발생 시 해당 커밋만 되돌리면 원복 가능
- 폰트 전환은 전체 텍스트 렌더링에 영향 → Design Sprint 1 완료 직후 반드시 브라우저 확인 후 Sprint 2 진행
- 다크모드는 design.md에 명시되지 않은 영역이라 임의 해석이 들어감 — 최종 검수 시 사용자 확인 필요

---

## 6. 완료 기준 (Definition of Done)

- [ ] `design.md`에 명시된 Primary/Background/Radius/Typography가 코드에 100% 반영됨
- [ ] 라이트·다크 모드 모두 빌드/타입체크 통과
- [ ] 기존 PRD 기능(사진 인식, 레시피 추천, 예외 처리 등) 동작에 회귀 없음
- [ ] 리뷰 섹션 등 범위 외 기능은 추가하지 않음
