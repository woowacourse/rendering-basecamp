# 영화 리뷰 — Next.js Hybrid Rendering

`../react-csr`의 인기 영화 목록, 추천 영화, 상세 모달, 내 별점 기능과 CSS를 Next.js **Pages Router**로 옮겼습니다. 영화 데이터와 페이지 HTML은 서버에서 준비하고, 별점 저장과 모달 조작은 hydration 이후 브라우저에서 처리합니다.

운영 주소: [영화 리뷰](https://rendering-basecamp-nextjs-eosin.vercel.app)

## 실행과 검증

```bash
cd nextjs
npm ci
cp .env.example .env.local
```

`.env.local`의 `TMDB_ACCESS_TOKEN`에 TMDB API Read Access Token을 입력합니다. 기존 `.env`가 있다면 같은 이름을 사용합니다. `NEXT_PUBLIC_` 접두사는 붙이지 않습니다.

```bash
npm run dev
```

프로덕션 환경 검증:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

서버를 실행한 상태에서 다른 터미널로 SSR 회귀 테스트를 실행합니다. 실제 TMDB API를 사용하므로 유효한 토큰과 네트워크 연결이 필요합니다.

```bash
npm run test:ssr
# 다른 포트나 운영 배포를 검사할 때
TEST_BASE_URL=https://rendering-basecamp-nextjs-eosin.vercel.app npm run test:ssr
```

## 요구사항 적용

| URL / 파일 | 역할 |
| --- | --- |
| `/` — `src/pages/index.tsx` | `getServerSideProps`에서 인기 영화 조회 후 첫 HTML에 추천 영화와 목록 렌더링 |
| `/detail/:id` — `src/pages/detail/[id].tsx` | 영화 상세와 인기 목록을 병렬 조회하고 상세 모달까지 SSR |
| `src/pages/_app.tsx` | 공통 CSS와 viewport 설정 |
| `src/pages/_document.tsx` | 문서 언어 `ko` 설정 |
| `src/components/PageHead.tsx` | `next/head`로 영화별 title, description, OG, Twitter, canonical 태그 주입 |
| `/robots.txt`, `/sitemap.xml` | 크롤링 허용과 현재 인기 영화의 상세 URL 안내 |

기존 앱에서 상세 모달은 클릭 또는 `useEffect` 이후에 열렸습니다. 마이그레이션 후에는 영화 카드와 ‘자세히 보기’가 `next/link`로 상세 주소를 열며, URL을 공유하거나 직접 접속해도 첫 HTML에 제목·장르·줄거리·평점·포스터와 영화별 메타 태그가 있습니다. JavaScript를 꺼도 영화 상세와 홈으로 돌아가는 링크를 읽을 수 있습니다.

별점은 기존과 같은 `sessionStorage` 키 `movie-ratings`와 점수 체계(2, 4, 6, 8, 10)를 사용합니다. 서버와 첫 클라이언트 렌더는 별점 0으로 시작하고, `useEffect`에서 저장된 별점을 복원하여 hydration 불일치를 피합니다. 닫기 링크, Escape, 브라우저 뒤로 가기를 지원합니다.

잘못된 ID 또는 TMDB에서 존재하지 않는 영화는 실제 404로 응답합니다. 홈 데이터 조회 실패는 503, 상세 API 장애는 500으로 처리합니다. 인기 목록 조회만 실패한 경우에도 요청한 영화 상세는 표시합니다.

## LCP 개선

- 홈 데이터를 브라우저의 `useEffect`에서 조회하던 과정을 제거하여 첫 HTML부터 콘텐츠를 표시합니다.
- 배경은 기존과 같은 TMDB의 가로형 이미지를 CDN에서 직접 받습니다. `next/image`의 `unoptimized`로 Vercel에서 처음 변환할 때 생기는 지연을 피하고, 기존 디자인은 유지했습니다. 목록 포스터는 Next.js 이미지 최적화를 사용합니다.
- 홈 배경 이미지에 `priority`와 `fetchPriority="high"`를 적용하여 HTML에서 preload하고 먼저 요청합니다.
- 목록 포스터는 크기를 고정하고 지연 로딩합니다. 상세 링크 자동 prefetch는 끄므로 홈 진입 직후 모든 영화 상세 SSR 요청이 발생하지 않습니다.
- 사용자별 별점을 HTML에 포함하지 않으므로 영화 페이지에 `s-maxage=60, stale-while-revalidate=300`으로 Vercel CDN 캐시를 적용합니다. 실패 응답은 캐시하지 않습니다.

2026-10-02, Chrome 154.0.8037.93에서 각 조건을 3회 측정했습니다. 매 회 새 브라우저 컨텍스트를 만들고 브라우저 캐시를 비활성화했습니다. CDN MISS는 매번 고유한 쿼리로 요청하고 `x-vercel-cache` 응답을 확인했습니다.

| 환경 | 데스크톱 1440×900 LCP 중앙값 | 모바일 390×844 LCP 중앙값 |
| --- | --- | --- |
| React CSR 로컬 | 2.63초 | 2.42초 |
| Next.js 로컬 | 1.36초 | 1.25초 |
| Next.js 운영 CDN HIT | 1.32초 | 1.32초 |
| Next.js 운영 CDN MISS | 1.45초 | 1.58초 |

최종 운영 측정 12회는 모두 3초 이내(1.30–1.63초)였습니다. [원시 측정값](tests/performance-results.json)에 조건과 회차별 결과를 기록했습니다. Vercel 함수 인스턴스와 TMDB CDN 자체의 캐시는 가동된 상태일 수 있습니다.

Chrome DevTools Fast 4G 프리셋과 같은 보정값(다운로드 1,012,500 B/s, 업로드 168,750 B/s, 지연 165ms), CPU 4배 저속화, DPR 1을 사용했습니다. 로컬 측정은 Vercel의 서버 위치와 CDN, 실제 이용자의 기기·네트워크 상태를 반영하지 않으므로 운영 결과를 별도로 확인해야 합니다. 이탈률 10% 감소는 시나리오의 가설이며 이 측정으로 검증한 결과는 아닙니다.

운영 확인은 프로덕션 배포에서 Chrome DevTools Performance를 열고 Fast 4G, 캐시 비활성화, 같은 화면 크기로 새로고침을 3회 이상 기록하여 LCP 중앙값과 3초 목표를 비교합니다. 검색 결과 노출 여부는 배포 후 Google Search Console에 사이트맵을 제출하여 확인할 수 있습니다.

## Vercel 배포

프로젝트 `rendering-basecamp-nextjs`에 Git 저장소를 연결했으며 **Root Directory는 `nextjs`**, Framework Preset은 **Next.js**로 지정합니다. 빌드는 `npm run build`를 사용하며 정적 export를 설정하지 않습니다.

| 환경 변수 | 용도 |
| --- | --- |
| `TMDB_ACCESS_TOKEN` | 필수. 서버에서 TMDB API를 조회하는 토큰. Production과 Preview에 비밀 환경 변수로 등록 |
| `SITE_URL` | 선택. canonical 및 OG URL에 사용할 운영 주소. 생략하면 Vercel 운영 도메인, 배포 도메인 순서로 사용 |

CLI는 **rendering-basecamp 저장소 루트**에서 실행합니다. 루트의 `.vercelignore`가 다른 실습 프로젝트와 로컬 환경 변수 파일의 업로드를 제외합니다.

```bash
npx vercel login
npx vercel link --project rendering-basecamp-nextjs
npx vercel env add TMDB_ACCESS_TOKEN production
npx vercel env add TMDB_ACCESS_TOKEN preview
npx vercel --prod
```

## 검증 항목

SSR 테스트는 홈 HTML의 영화 목록·상세 링크·이미지 preload, 상세 HTML의 영화 내용·OG·canonical, 실제 404 응답, robots·사이트맵을 검사합니다.

브라우저에서는 상세 이동, 별점 저장·새로고침·재진입, 영화별 별점 분리, 모달 닫기·Escape·뒤로 가기, 모바일 가로 넘침, JavaScript 비활성화 상태의 상세 렌더링을 확인했습니다. 브라우저의 TMDB API 직접 요청과 hydration 오류가 없으며, 프로덕션 클라이언트 번들에 TMDB 토큰이 포함되지 않는 것도 확인했습니다.

참고 문서: [getServerSideProps](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props), [Pages Router](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts), [Head](https://nextjs.org/docs/pages/api-reference/components/head), [Image](https://nextjs.org/docs/15/pages/api-reference/components/image), [Vercel CLI](https://vercel.com/docs/cli/deploy), [Chrome Fast 4G 프리셋](https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/core/sdk/NetworkManager.ts).
