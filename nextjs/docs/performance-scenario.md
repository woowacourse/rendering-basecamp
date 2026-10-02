# 성능 시나리오

> `/` 홈 화면 Fast 4G 기준 LCP 가 4초이다. LCP 를 3초까지 개선하면, 이탈율이 10% 감소하여, 신규 유저 유입을 더 늘릴 수 있을 것이다.

## 0. 측정 케이스

| Case | 환경 | 네트워크 | CPU | 상태 |
| --- | --- | --- | --- | --- |
| [A](#case-a--로컬-production--fast-4g) | 로컬 production 빌드 | Fast 4G | 스로틀 없음 | ✅ 완료 |
| [B](#case-b--로컬-production--fast-4g--cpu-4x) | 로컬 production 빌드 | Fast 4G | 4x slowdown | ✅ 완료 |
| [C](#case-c--배포-환경--fast-4g--cpu-4x) | 배포 환경 (Vercel) | Fast 4G | 4x slowdown | ✅ 완료 |

### 공통 측정 방법

| 항목 | 값 |
| --- | --- |
| 페이지 | `/` (홈) |
| 도구 | Chrome DevTools > Performance 패널 (Screenshots 활성화) |
| 조건 | 시크릿 창, Network > Disable cache 활성화 |
| 횟수 | 조합(Case × CSR/SSR)마다 **5회** 측정, 표의 값은 **중앙값** |
| 스크린샷 | 5회 중 1회를 대표로 캡처 (캡션에 해당 회차 값 표기) |
| CSR 실행 (로컬) | `../react-csr` 에서 `npm run build && npm run preview` → `http://localhost:4173/` |
| SSR 실행 (로컬) | `nextjs` 에서 `npm run build && npm run start` → `http://localhost:3000/` |
| CSR 배포 URL | https://rendering-basecamp-csr-neon.vercel.app/ |
| SSR 배포 URL | https://rendering-basecamp-nextjs-psi.vercel.app/ |

### 개선 내용 (Next.js SSR)

`src/pages/index.tsx` 에서 `getServerSideProps` 로 `popular` 영화 목록을 서버에서 미리 가져와 props 로 내려준다.
그 결과 서버 응답 HTML 에 히어로 `h1`(영화 제목)과 영화 목록이 이미 포함되어 LCP 까지의 경로에서 클라이언트 JS 다운로드와 실행, API 요청 단계가 빠진다.

### 측정 원본 (5회)

| 조합 | LCP | FCP |
| --- | --- | --- |
| A-CSR | 1.77 s, 1.81 s, 1.33 s, 1.33 s, 1.33 s | 582.6, 580.0, 585.7, 577.1, 589.5 ms |
| A-SSR | 1.02 s, 824.5 ms, 874.8 ms, 782.7 ms, 796.5 ms | LCP 와 동일 |
| B-CSR | 1.64 s, 1.58 s, 1.54 s, 1.56 s, 1.62 s | 584.5, 590.9, 603.8, 589.0, 584.8 ms |
| B-SSR | 1,058.3, 947.7, 1,325.0, 1,035.7, 1,017.2 ms | LCP 와 동일 |
| C-CSR | 1.78 s, 2.03 s, 1.61 s, 1.54 s, 1.55 s | 659.5, 600.8, 592.8, 587.2, 587.2 ms |
| C-SSR | 0.74 s, 0.77 s, 0.69 s, 0.81 s, 0.66 s | LCP 와 동일 (1회차 740.9 ms) |

- LCP 요소는 캡처한 회차 기준 CSR/SSR 모두 `h1.text-3xl.font-semibold` (히어로 영화 제목, Type: text) 이다.
- SSR 은 모든 회차에서 FCP 와 LCP 가 같은 값으로 찍혔다.

---

## Case A — 로컬 production / Fast 4G

### A-1. 기준치 (Baseline) — `react-csr`

![CSR 홈 LCP Fast 4G](./images/csr-home-lcp-fast4g.png)

> 캡처: 1회차 (LCP 1.77 s)

| 지표 | 값 (중앙값) |
| --- | --- |
| **LCP** | **1.33 s** |
| FCP | 582.6 ms (스피너) |
| LCP 요소 | `h1.text-3xl.font-semibold` |

#### 타임라인 분석 (캡처 회차 기준)

```
0 ms ──── ~0.2 s ──────── ~0.5 s ──── ~0.58 s ─────────────────── ~1.3 s ─────── ~1.6 s ──── 1.77 s
│ HTML(빈 #root) │ CSS/JS 다운로드 │ DCL/FCP(스피너) │ popular API 요청 대기 │ API 응답 │ 렌더 │ LCP(h1)
```

1. **HTML 수신 → 빈 화면**: 서버가 내려주는 HTML 에는 `<div id="root">` 만 있어 받는 문서에 콘텐츠가 없다.
2. **CSS / JS 번들 다운로드**: `index-*.css`, `index-*.js` 를 받아온다.
3. **JS 실행 후 로딩 스피너 (FCP)**: DCL 직후 React 가 마운트되며 `spin` 애니메이션이 그려진다. FCP 가 찍히지만, 사용자에게 보이는 건 스피너뿐이다.
4. **API 요청 → 렌더**: 마운트 이후에야 `popular` 영화 API(`api.themoviedb.org`)를 요청한다. 스피너는 약 1 s 동안 이어지고, 응답이 오면 히어로 `h1` 이 그려지며 LCP 가 찍힌다.
5. **이미지는 그 이후**: 영화 포스터/히어로 이미지는 LCP 시점부터 다운로드된다.

#### 병목 요약

LCP 까지의 경로가 HTML → CSS/JS 다운로드 → JS 실행 → API 요청 → 렌더로 직렬화된 CSR 워터폴이 주된 원인이다.
FCP(스피너)와 LCP(h1) 사이 약 0.75 s(중앙값 기준)는 대부분 마운트 후 시작되는 API 왕복 시간이다.

### A-2. 개선 — `nextjs` (SSR)

![SSR 홈 LCP Fast 4G](./images/ssr-home-lcp-fast4g.png)

> 캡처: 추가 측정 회차 (LCP 1.09 s, 5회 측정값에는 미포함)

| 지표 | 값 (중앙값) |
| --- | --- |
| **LCP** | **824.5 ms** |
| FCP | 824.5 ms (LCP 와 동일) |
| LCP 요소 | `h1.text-3xl.font-semibold` |

#### 타임라인 분석

1. **HTML 수신**: `/` 문서 응답에 이미 렌더링된 마크업(히어로 제목, 영화 목록)이 담겨 온다. 서버가 응답 전에 TMDB API 를 호출하므로 문서 응답(TTFB)은 CSR 보다 길어지지만, 클라이언트에서 API 응답을 기다릴 필요는 없다.
2. **FCP = LCP**: HTML 이 파싱되자마자 h1 이 포함된 첫 화면이 그려진다. 하이드레이션(`before-hydration` 구간)보다 먼저 페인트가 일어난다.
3. **JS 로드 & 하이드레이션**: 페인트 이후 Next.js 런타임/페이지 번들을 받아 실행하고 인터랙션을 붙인다.
4. **이미지는 그 이후**: 히어로 배경 이미지는 페인트 이후 다운로드되지만, LCP 후보로 갱신되지 않아 LCP 는 텍스트로 유지된다.

#### 왜 FCP 와 LCP 가 같을까?

- **SSR 이라서**: 서버가 데이터를 채운 완성된 HTML 을 내려주므로, 처음 화면이 그려질 때 가장 큰 텍스트 요소(h1)도 함께 그려진다. 첫 페인트가 곧 가장 큰 콘텐츠의 페인트가 된다.
  CSR 에서는 첫 페인트가 로딩 스피너이고, h1 은 API 응답 이후에 그려지므로 둘 사이에 간격이 생긴다.
- **참고 — dev 모드에서는 둘 다 1.79 s 였다**: Pages Router 의 `next dev` 는 스타일이 적용되기 전 화면 깜빡임(FOUC)을 막기 위해 `body { display: none }` 스타일(`data-next-hide-fouc`)을 넣어두고, 클라이언트에서 CSS 가 준비되는 시점에 제거한다.
  그래서 dev 에서는 하이드레이션 직전까지 아무것도 그려지지 않았지만, production 에서는 이 처리가 없어 HTML 수신 직후(하이드레이션 전)에 바로 페인트된다.

### A-3. 결과 비교

| 지표 | CSR (`react-csr`) | SSR (`nextjs`) | 변화 |
| --- | --- | --- | --- |
| **LCP** | 1.33 s | **824.5 ms** | **약 −0.51 s (약 38% 개선)** |
| FCP | 582.6 ms (스피너) | 824.5 ms (LCP 와 동일) | 약 +0.24 s |
| LCP 요소 | `h1.text-3xl.font-semibold` | `h1.text-3xl.font-semibold` | 동일 |
| LCP 경로 | HTML → JS → 실행 → API → 렌더 | HTML(데이터 포함) → 페인트 | 클라이언트 API 왕복 제거 |

#### 결론

- 시나리오 목표인 LCP 3 s 이하는 두 방식 모두 만족하며, SSR 로 LCP 를 1.33 s 에서 824.5 ms 로 추가 단축했다.
- 대신 서버가 응답 전에 API 를 기다리므로 FCP 는 오히려 늘어났다 (582.6 ms → 824.5 ms). CSR 은 스피너를 빨리 보여주고 콘텐츠를 나중에 보여주는 반면, SSR 은 조금 늦게 시작하지만 처음부터 콘텐츠를 보여준다는 트레이드오프가 있다.

---

## Case B — 로컬 production / Fast 4G + CPU 4x

> 실제 사용자(중저사양 모바일)의 JS 실행과 레이아웃 비용을 재현하기 위해 DevTools Performance 패널에서 **CPU: 4x slowdown** 을 추가로 적용했다.

### B-1. 기준치 (Baseline) — `react-csr`

![CSR 홈 LCP Fast 4G + CPU 4x](./images/csr-home-lcp-fast4g-cpu4x.png)

> 캡처: 추가 측정 회차 (LCP 1.57 s, 5회 측정값에는 미포함)

| 지표 | 값 (중앙값) |
| --- | --- |
| **LCP** | **1.58 s** |
| FCP | 589.0 ms (스피너) |
| LCP 요소 | `h1.text-3xl.font-semibold` |

#### 타임라인 분석

1. **HTML → CSS/JS 다운로드 → DCL**: Case A 와 같은 흐름이지만, JS 파싱과 실행이 4배 느려진다.
2. **FCP = 스피너**: React 마운트 후 `spin` 애니메이션이 노출된다.
3. **API 요청 대기**: 스피너가 약 0.85 s 동안 노출되는 사이 `popular` API 가 약 1.43 s 에 응답한다.
4. **렌더 + Layout (Long Task)**: 응답 후 영화 목록을 렌더링하는 `Task`/`Layout` 이 **Long Task** 로 찍히고, 끝나면 LCP 1.57 s 가 찍힌다 (캡처 회차 기준).

#### 병목 요약

- CPU 가 느려지자 API 응답 후 렌더와 레이아웃 단계가 길어져, Case A 보다 LCP 가 약 0.25 s 늘었다 (1.33 s → 1.58 s).
- 5회 모두 1.54 ~ 1.64 s 로 편차가 작았다.

> 📝 이전 1회 측정에서는 CSR LCP 가 5.25 s 로 찍혔지만(3.9 s 짜리 공백 프레임 포함), 5회 재측정에서는 한 번도 재현되지 않아 이상치로 보고 제외했다.

### B-2. 개선 — `nextjs` (SSR)

![SSR 홈 LCP Fast 4G + CPU 4x](./images/ssr-home-lcp-fast4g-cpu4x.png)

> 캡처: 5회차 (LCP 1,017.2 ms)

| 지표 | 값 (중앙값) |
| --- | --- |
| **LCP** | **1,035.7 ms** |
| FCP | 1,035.7 ms (LCP 와 동일) |
| LCP 요소 | `h1.text-3xl.font-semibold` |

#### 타임라인 분석 (캡처 회차 기준)

1. **HTML 수신 (늦음)**: 로컬 Next.js 서버가 TMDB API 응답을 기다린 뒤 HTML 을 내려준다. Insights 의 `Document request latency` 가 **Est savings: 506 ms** 로 잡힐 만큼 문서 응답이 늦다.
2. **Layout (Long Task)**: 데이터가 채워진 HTML 을 받은 뒤, 영화 목록 전체에 대한 `Layout` 이 약 0.2 s 짜리 **Long Task** 로 찍힌다. CPU 가 4배 느려지면서 큰 DOM 의 레이아웃 비용이 드러났다.
3. **FCP = LCP (1,017.2 ms)**: 레이아웃 직후 h1 이 포함된 첫 화면이 그려진다. 하이드레이션(`before-hydration`) 완료 전에 페인트가 일어난다.
4. **JS 실행 & 하이드레이션**: 페인트 이후 번들을 실행하며 하이드레이션한다. 이미 화면이 그려진 이후라 LCP 에는 영향을 주지 않는다.

### B-3. 결과 비교

| 지표 | CSR (`react-csr`) | SSR (`nextjs`) | 변화 |
| --- | --- | --- | --- |
| **LCP** | 1.58 s | **1,035.7 ms** | **약 −0.54 s (약 34% 개선)** |
| FCP | 589.0 ms (스피너) | 1,035.7 ms (LCP 와 동일) | 약 +0.45 s |
| Long Task | API 응답 후 렌더/Layout | 첫 페인트 전 Layout (~0.2 s) | — |
| LCP 경로 | HTML → JS → 실행 → API → 렌더 → 레이아웃 | HTML(데이터 포함) → 레이아웃 → 페인트 | JS 실행과 API 왕복 제거 |

#### 결론

- SSR 로 LCP 를 1.58 s 에서 1,035.7 ms 로 약 34% 단축했다.
- 개선 폭은 Case A(−38%)와 비슷하다. CPU 스로틀이 CSR 의 렌더 비용뿐 아니라 SSR 의 첫 페인트 전 `Layout` 비용도 함께 늘렸기 때문이다.
- FCP 는 SSR 이 약 0.45 s 늦다. 로컬 서버가 TMDB API 를 기다리는 시간(문서 응답 지연)과 레이아웃 비용이 모두 첫 페인트 앞에 놓여 있기 때문이다.

---

## Case C — 배포 환경 / Fast 4G + CPU 4x

> Vercel 에 배포한 CSR/SSR 앱을 Case B 와 같은 조건(Fast 4G + CPU 4x slowdown)으로 측정했다.

### C-1. 기준치 (Baseline) — `react-csr`

![CSR 홈 LCP Fast 4G + CPU 4x (배포)](./images/csr-home-lcp-fast4g-cpu4x-deploy.png)

> 캡처: 5회차 (LCP 1.55 s, FCP 587.2 ms)

| 지표 | 값 (중앙값) |
| --- | --- |
| **LCP** | **1.61 s** |
| FCP | 592.8 ms (스피너) |
| LCP 요소 | `h1.text-3xl.font-semibold` |

#### 타임라인 분석 (캡처 회차 기준)

```
0 ms ─── ~0.19 s ──────── ~0.47 s ──── ~0.52 s ──── 587 ms ────────────────── ~1.3 s ───── ~1.43 s ──────── 1.55 s
│ HTML(빈 #root) │ CSS/JS 다운로드 │ DCL        │ FCP(스피너) │ popular API 요청 대기 │ API 응답 │ 렌더/Layout   │ LCP
│               │               │            │            │                       │         │ (Long Task)   │
```

1. **HTML → CSS/JS 다운로드 → DCL(~0.52 s)**: 빈 HTML 이후 `index-*.css`, `index-*.js` 를 받아온다.
2. **FCP(587.2 ms) = 스피너**: React 마운트 후 `spin` 애니메이션이 약 0.9 s 동안 노출된다.
3. **API 요청 → 응답**: `popular` 영화 API 가 약 1.43 s 에 응답한다.
4. **렌더 + Layout (Long Task)**: 응답 후 영화 목록 렌더링과 `Layout` 이 **Long Task** 로 찍히고, 끝나자마자 **LCP 1.55 s** 가 찍힌다.

#### 병목 요약

- Case B 와 같은 직렬 워터폴(JS 실행 → API 요청 → 렌더 → 레이아웃)이다.
- FCP(스피너)와 LCP 사이 약 1 s 는 API 대기와 렌더/레이아웃 Long Task 다.

### C-2. 개선 — `nextjs` (SSR)

![SSR 홈 LCP Fast 4G + CPU 4x (배포)](./images/ssr-home-lcp-fast4g-cpu4x-deploy.png)

> 캡처: 5회차 (LCP 0.66 s)

| 지표 | 값 (중앙값) |
| --- | --- |
| **LCP** | **740.9 ms** |
| FCP | 740.9 ms (LCP 와 동일) |
| LCP 요소 | `h1.text-3xl.font-semibold` |

#### 타임라인 분석 (캡처 회차 기준)

1. **HTML 수신 (~0.27 s)**: Vercel 서버에서 TMDB API 를 호출해 데이터를 채운 HTML 을 내려준다. 로컬(Case B)보다 문서 응답이 훨씬 빠르다.
2. **Layout (Long Task)**: CSS 와 JS 를 받은 뒤 영화 목록 전체에 대한 `Layout` 이 **Long Task** 로 찍힌다 (Case B 와 동일한 패턴).
3. **FCP = LCP (0.66 s)**: 하이드레이션(`before-hydration`) 완료 전에 h1 이 포함된 첫 화면이 그려진다.
4. **JS 실행 & 하이드레이션**: 페인트 직후 스크립트 실행(노란 구간)과 하이드레이션이 이어진다.
5. **이미지는 그 이후**: 히어로 배경 이미지(`8mLepBa…jpg`)는 레이아웃 시작 무렵부터 받아 페인트 이후에 완료된다.

### C-3. 결과 비교

| 지표 | CSR (`react-csr`) | SSR (`nextjs`) | 변화 |
| --- | --- | --- | --- |
| **LCP** | 1.61 s | **740.9 ms** | **약 −0.87 s (약 54% 개선)** |
| FCP | 592.8 ms (스피너) | 740.9 ms (LCP 와 동일) | 약 +0.15 s |
| Long Task | API 응답 후 렌더/Layout | 첫 페인트 전 Layout | — |
| LCP 경로 | HTML → JS → 실행 → API → 렌더 → 레이아웃 | HTML(데이터 포함) → 레이아웃 → 페인트 | JS 실행과 API 왕복 제거 |

#### 결론

- 배포 환경에서 SSR 로 LCP 를 1.61 s 에서 740.9 ms 로 약 54% 단축했다. 세 케이스 중 개선 폭이 가장 크다.
- 같은 CPU 4x 조건인 Case B(−34%)보다 개선 폭이 큰 이유는 SSR 의 문서 응답 속도 차이로 보인다. 로컬 서버는 TMDB API 왕복 때문에 문서 응답이 늦었지만, 배포 서버는 이 대기가 짧아 FCP 증가도 +0.15 s 에 그쳤다.

---

## 종합

| Case | 환경 | CSR LCP | SSR LCP | 변화 | 목표(3 s) 달성 |
| --- | --- | --- | --- | --- | --- |
| A | 로컬 / Fast 4G | 1.33 s | 824.5 ms | 약 −38% | CSR ✅ / SSR ✅ |
| B | 로컬 / Fast 4G + CPU 4x | 1.58 s | 1,035.7 ms | 약 −34% | CSR ✅ / SSR ✅ |
| C | 배포 / Fast 4G + CPU 4x | 1.61 s | 740.9 ms | 약 −54% | CSR ✅ / SSR ✅ |

> 모든 값은 5회 측정의 중앙값이다.

- 시나리오의 "LCP 4초" 는 어떤 케이스에서도 재현되지 않았다. CSR 기준치도 1.3 ~ 1.6 s 로 목표(3 s)보다 낮다.
- 그래도 모든 케이스에서 SSR 적용 후 LCP 가 34 ~ 54% 단축되었다. SSR 은 LCP 경로에서 클라이언트 JS 실행과 API 왕복을 제거하기 때문이다.
- 트레이드오프로 서버가 API 응답을 기다리는 만큼 FCP 는 늘어난다 (+0.15 ~ 0.45 s). 이 비용은 SSR 서버와 API 서버 사이 거리에 크게 좌우된다 (로컬 B +0.45 s, 배포 C +0.15 s).
- SSR 에서 남은 병목은 첫 페인트 전 `Layout` Long Task(약 0.2 s)로, 초기 렌더링하는 영화 목록 DOM 크기를 줄이면 추가 개선 여지가 있다.
