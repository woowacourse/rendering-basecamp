# rendering-basecamp

## 🚀 2단계: React + Node.js로 Hybrid Rendering 구현하기

### ⛳️ 학습 목표

- React 기반의 앱을 SSR 방식으로 렌더링 하고, 이후에 CSR로 동작하도록 구현할 수 있다.

### 🎯 기능 요구사항

- `/`와 `/detail/:id` url에서 react-csr에서와 동일한 화면을 SSR로 반환한다.
- 응답 받은 후, 정상적으로 사이트 이용이 가능하다.

### 💻 프로그래밍 요구사항

- Node.js로 SSR server를 띄우면서, React로 만들어진 컴포넌트를 응답하도록 구현한다. [react-dom/server의 renderToString](https://ko.react.dev/reference/react-dom/server/renderToString)을 활용하여 구현한다.
- 응답 받은 후, hydration 과정을 거쳐, CSR로 동작하도록 구현한다. [react-dom/client의 hydrateRoot](https://ko.react.dev/reference/react-dom/client/hydrateRoot)를 활용하여 구현한다.
- (선택) 배포는 [Railway](https://railway.com/) 등 무료 플랫폼을 활용한다.

## 🚀 미니 미션 - Node.js로 Classic SSR 구현하기

### ⛳️ 학습 목표

- SSR의 기본 원리가 되는 Server를 이해한다.
- SSR이 왜 성능이 빠른지, 왜 SEO가 좋은지 이해한다.

### 🎯 기능 요구사항

- `/`와 `/detail/:id` url에서 react-csr에서와 동일한 화면을 SSR로 반환한다.
- 사용자 인터랙션은 동작하지 않아도 된다.

### 💻 프로그래밍 요구사항

- `/public`의 html, css 리소스를 기반으로, 구현한다.
- UI 나 디테일한 부분은 신경쓰지 않아도 된다. API endpoint와 그에 맞는 HTML 응답받는 흐름을 이해한다.
  - 서버 API 개발은 Node.js 라이브러리인 express를 활용한다.
  - API 내에서 TMDB를 동적으로 받아오고, 동적으로 html을 생성해야 한다.
- [Railway](https://railway.com/)로 서버를 무료 배포하여, 결과물을 확인한다.
  - `/detail/:id`에서 og tag가 정상 동작하도록 구현한다.
  - `/`에서 FCP가 개선되었음을 확인한다.

## 🚀 1단계: Next.js로 Hybrid Rendering 구현하기

### ⛳️ 학습 목표

- Next.js를 활용하여, SSR의 이점을 빠르게 이해하는 것을 목표로 한다.
- Next.js라는 기술 자체에 매몰되지 않는다.

### 🎯 기능 요구사항

- `/react-csr` 은 영화 리뷰 미션를 CSR로 구현한 것이다. 이 기능을 그대로 하며, 아래 시나리오에 맞게 Next.js로 개선한다.
- 성능 시나리오
  - `/` 홈 화면 Fast 4G 기준 LCP가 4초이다. LCP를 3초까지 개선하면, 이탈율이 10% 감소하여, 신규 유저 유입을 더 늘릴 수 있을 것이다.
- open graph (og) tag 시나리오
  - 영화를 친구에게 공유해도, 영화 제목과 이미지가 미리보기로 뜨지 않는다. 디자이너는 유저 경험을 개선하기 위해서, 미리보기에 영화 제목과 이미지가 나오길 원한다.
- SEO 시나리오 (선택 미션)
  - `/detail/:id` 상세 페이지가 구글에 검색되지 않는다. 구글에 검색된다면, 유입을 늘릴 수 있을 것이다. 팀 내에서 SEO를 기반으로, 유입을 늘리는 전략을 택하려고 한다.

### 💻 프로그래밍 요구사항

- `/react-csr` 코드를 그대로 `/nextjs`로 마이그레이션 한다.
- 배포는 [vercel](https://vercel.com/)로 진행한다.
- Next.js에서 아래 개념들을 학습하고 적용한다.
  - [getServerSideProps](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props)
  - [page router가 사용하는 file-system based router](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts)
  - [head에 meta tag 주입하는 방법](https://nextjs.org/docs/pages/api-reference/components/head)
- 이외의 개념을 크게 학습할 필요는 없다. 이 미션은 Next.js를 학습하기 위함이 아니라, SSR 방식이 CSR-only 방식에 비해서 어떤 이점을 가지는지 이해하기 위함이다.
