# Open Graph (OG) 태그

> 링크를 공유했을 때 영화 제목, 설명, 포스터가 미리보기 카드로 보이게 한다.

## 1. OG 태그란?

링크를 공유할 때 카카오톡, 슬랙 등에 보이는 **미리보기 카드**의 내용을 정하는 `<meta>` 태그이다.

| 태그             | 역할                                      |
| ---------------- | ----------------------------------------- |
| `og:title`       | 카드에 보이는 제목                        |
| `og:description` | 제목 아래 설명                            |
| `og:image`       | 카드 썸네일 이미지                        |
| `og:url`         | 공유되는 페이지의 대표 URL                |
| `og:type`        | 콘텐츠 종류 (`website`, `video.movie` 등) |

```html
<meta property="og:title" content="영화 제목" />
<meta property="og:description" content="영화 줄거리" />
<meta
  property="og:image"
  content="https://image.tmdb.org/t/p/w500/poster.jpg"
/>
```

### 왜 SSR 이 필요할까?

미리보기를 만드는 크롤러(페이지를 자동으로 읽는 봇)는 대부분 **JS 를 실행하지 않고 처음 받은 HTML 만 읽는다.**

- **CSR**: 서버 HTML 에는 빈 `<div id="root">` 만 있으므로 JS 가 실행된 뒤에 태그를 넣어도 크롤러는 보지 못한다.
- **SSR**: 서버가 데이터를 받아 태그를 채운 HTML 을 내려주므로 크롤러가 바로 읽을 수 있다.

특히 상세 페이지처럼 **페이지마다 내용이 다른 OG 태그**는 서버에서 데이터를 가져와야만 채울 수 있다.

## 2. 이 프로젝트에 적용하는 방법

이 프로젝트는 Next.js **Pages Router** 를 쓰므로, 각 페이지에서 `next/head` 의 `<Head>` 안에 OG 태그를 넣는다.

| 페이지                   | 파일                             | OG 내용                        |
| ------------------------ | -------------------------------- | ------------------------------ |
| 홈 `/`                   | `src/pages/index.tsx`            | 사이트 공통 정보               |
| 상세 `/detail/[movieId]` | `src/pages/detail/[movieId].tsx` | `movieDetail` 기반 영화별 정보 |

### 2-1. 홈: 사이트 공통 OG

기존 `<Head>` 에 공통 태그를 추가한다. 이미지는 히어로 영역에 쓰는 첫 번째 인기 영화의 배경 이미지를 사용한다.

```tsx
const featuredMovie = movies[0];
const ogImagePath = featuredMovie?.backdrop_path ?? featuredMovie?.poster_path;

<Head>
  <title>영화 리뷰</title>
  <meta key="og:type" property="og:type" content="website" />
  <meta key="og:title" property="og:title" content="영화 리뷰" />
  <meta
    key="og:description"
    property="og:description"
    content="지금 인기 있는 영화를 확인해 보세요."
  />
  {ogImagePath && (
    <meta
      key="og:image"
      property="og:image"
      content={`https://image.tmdb.org/t/p/w1280${ogImagePath}`}
    />
  )}
</Head>;
```

### 2-2. 상세: 영화별 OG

`getServerSideProps` 에서 이미 `movieDetail` 을 받고 있으므로, 받은 `movieDetail` 값으로 태그를 채운다.

```tsx
const { title, overview, backdrop_path, poster_path } = movieDetail;
const ogImagePath = backdrop_path ?? poster_path;

<>
  <Home popularMovies={popularMovies} />
  <Head>
    <title>{`${title} | 영화 리뷰`}</title>
    <meta key="og:type" property="og:type" content="video.movie" />
    <meta key="og:title" property="og:title" content={title} />
    <meta key="og:description" property="og:description" content={overview} />
    {ogImagePath && (
      <meta key="og:image" property="og:image" content={`https://image.tmdb.org/t/p/w1280${ogImagePath}`} />
    )}
  </Head>
  <MovieDetailModal ... />
</>
```

### 2-3. `key` 와 렌더링 순서로 중복 태그 막기

상세 페이지는 내부에서 `<Home />` 을 함께 렌더링하므로, 홈의 OG 태그와 상세의 OG 태그가 **둘 다 렌더링된다.**
`next/head` 는 같은 `key` 를 가진 태그(그리고 `<title>`)를 하나만 남기고, **나중에 렌더링된 태그**를 사용한다.

따라서 상세의 `<Head>` 는 반드시 **`<Home />` 보다 뒤에** 두어야 한다.

| 배치                  | 결과                                                                |
| --------------------- | ------------------------------------------------------------------- |
| `<Head>` → `<Home />` | 홈의 태그가 이겨서 모든 상세 페이지가 "영화 리뷰" 카드로 보인다. ❌ |
| `<Home />` → `<Head>` | 상세의 태그가 홈의 태그를 덮어쓴다. ✅                              |

### 2-4. 주의할 점

- `og:image` 는 **절대 URL** 이어야 크롤러가 이미지를 가져올 수 있다. TMDB 이미지 URL 은 이미 절대 URL 이라 그대로 쓴다.
- OG 이미지는 가로형(1.91:1, 약 1200×630)이 권장되므로 세로형 `poster_path` 보다 `backdrop_path` 를 먼저 쓴다.
- 이미지가 둘 다 없으면 `og:image` 를 넣지 않는다. (`/images/no_image.png` 같은 상대 경로는 크롤러가 읽지 못한다.)
- 카카오톡 등은 미리보기를 캐시하므로, 수정 후에는 각 서비스의 캐시 초기화 도구로 확인한다.

## 3. 확인 방법

1. `npm run build && npm run start` 로 실행한다.
2. `curl http://localhost:3000/detail/{movieId} | grep og:` 로 서버 HTML 에 태그가 들어있는지 확인한다.
3. 배포 후 [opengraph.xyz](https://www.opengraph.xyz/) 등에서 카드 미리보기를 확인한다.

## 4. 개선 내용

배포된 CSR 버전과 SSR(Next.js) 버전에 크롤러 User-Agent 로 요청을 보내, 크롤러가 실제로 받는 HTML 을 비교했다.

| 버전 | URL                                              |
| ---- | ------------------------------------------------ |
| CSR  | https://rendering-basecamp-csr-neon.vercel.app   |
| SSR  | https://rendering-basecamp-nextjs-psi.vercel.app |

```bash
curl -s -A facebookexternalhit/1.1 {URL}/detail/969681 | grep -oE '<title[^>]*>[^<]*</title>|<meta[^>]*og:[^>]*>'
```

### 4-1. 개선 전 (CSR)

홈과 상세 모두 크롤러가 받는 HTML 이 Vite 기본 템플릿 그대로이다.

```html
<title>Vite + React + TS</title>
...
<div id="root"></div>
```

- OG 태그가 **하나도 없다.** 그래서 미리보기 카드에 제목, 설명, 이미지가 나오지 않는다.
- `<title>` 이 `Vite + React + TS` 이므로, 카드가 나오더라도 의미 없는 제목이 표시된다.
- 상세 페이지 `/detail/969681` 도 홈과 **완전히 같은 HTML** 을 받는다. 영화 정보는 JS 실행 후에만 채워지기 때문에, 어떤 영화 링크를 공유해도 크롤러 입장에서는 구분할 수 없다.

### 4-2. 개선 방법

1. 홈과 상세 페이지를 Next.js Pages Router 의 `getServerSideProps` 로 SSR 전환했다. → 서버가 데이터를 받아 HTML 을 완성해서 내려준다.
2. 각 페이지의 `<Head>` 에 OG 태그를 추가했다. (자세한 코드는 [2. 이 프로젝트에 적용하는 방법](#2-이-프로젝트에-적용하는-방법) 참고)
   - 홈: 사이트 공통 제목, 설명 + 첫 번째 인기 영화의 배경 이미지
   - 상세: `movieDetail` 의 `title`, `overview`, `backdrop_path` 로 영화별 정보
3. 상세의 `<Head>` 를 `<Home />` 뒤에 두고 같은 `key` 를 써서, 홈의 OG 태그가 상세의 OG 태그로 덮어써지게 했다.

### 4-3. 개선 결과 (SSR)

**홈 `/`**

```html
<title>영화 리뷰</title>
<meta property="og:type" content="website" />
<meta property="og:title" content="영화 리뷰" />
<meta property="og:description" content="지금 인기 있는 영화를 확인해 보세요." />
<meta property="og:image" content="https://image.tmdb.org/t/p/w1280/qeQJx07rK2xm8SD2sJxFKhE7gs0.jpg" />
```

**상세 `/detail/969681`**

```html
<title>스파이더맨: 브랜드 뉴 데이 | 영화 리뷰</title>
<meta property="og:type" content="video.movie" />
<meta property="og:title" content="스파이더맨: 브랜드 뉴 데이" />
<meta property="og:description" content="4년 전 소중한 사람들을 지키기 위해 모두의 기억에서 사라진 피터 파커. ..." />
<meta property="og:image" content="https://image.tmdb.org/t/p/w1280/qeQJx07rK2xm8SD2sJxFKhE7gs0.jpg" />
```

| 항목                  | CSR (개선 전)        | SSR (개선 후)                    |
| --------------------- | -------------------- | -------------------------------- |
| `<title>`             | `Vite + React + TS`  | 홈: `영화 리뷰` / 상세: 영화 제목 |
| `og:title`            | 없음                 | 있음                             |
| `og:description`      | 없음                 | 홈: 공통 문구 / 상세: 줄거리     |
| `og:image`            | 없음                 | TMDB 배경 이미지 (절대 URL)      |
| 상세 페이지 구분      | 불가 (홈과 같은 HTML) | 영화마다 다른 OG 태그            |
| 중복 태그             | -                    | 없음 (`key` 로 홈 태그를 덮어씀) |

- 크롤러가 JS 를 실행하지 않아도 **첫 HTML 에 OG 태그가 들어 있다.**
- 상세 페이지 링크를 공유하면 **해당 영화의 제목, 줄거리, 이미지**가 미리보기 카드로 보인다.
- 상세 페이지에서 홈의 `og:type`(`website`)이 아니라 `video.movie` 가 나오는 것으로, 2-3 의 덮어쓰기가 의도대로 동작하는 것을 확인했다.

<!-- 공유 미리보기 스크린샷 (opengraph.xyz, 카카오톡 등)
![CSR 상세 공유 미리보기](./images/csr-og-preview.png)
![SSR 상세 공유 미리보기](./images/ssr-og-preview.png)
-->
