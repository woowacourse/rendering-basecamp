# rendering-basecamp

## 🎯 기능 요구사항

- `/react-csr`은 영화 리뷰 미션를 CSR 로 구현한 것이다. 이 기능을 그대로 하며, 아래 시나리오에 맞게 Next.js로 개선한다.
- 성능 시나리오
  - `/` 홈 화면 Fast 4G 기준 LCP가 4초이다. 
  - [x] LCP를 3초까지 개선하면, 이탈율이 10% 감소하여, 신규 유저 유입을 더 늘릴 수 있을 것이다.
- open graph (og) tag 시나리오
  - 영화를 친구에게 공유해도, 영화 제목과 이미지가 미리보기로 뜨지 않는다. 
  - [x] 디자이너는 유저 경험을 개선하기 위해서, 미리보기에 영화 제목과 이미지가 나오길 원한다.
- SEO 시나리오 (선택 미션)
  - [x] `/detail/:id` 상세 페이지가 구글에 검색되지 않는다. 구글에 검색된다면, 유입을 늘릴 수 있을 것이다. 
  - 팀 내에서 SEO를 기반으로, 유입을 늘리는 전략을 택하려고 한다.

<br><br>

## 💻 프로그래밍 요구사항

- [x] `/react-csr` 코드를 그대로 `/nextjs`로 마이그레이션 한다.
- [x] 배포는 vercel로 진행한다.
- [x] Next.js 에서 아래 개념들을 학습하고 적용한다.
  - [getServerSideProps](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props)
  - [page router가 사용하는 file-system based router](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts)
  - [head에 meta tag 주입하는 방법](https://nextjs.org/docs/pages/api-reference/components/head)
- 이외의 개념을 크게 학습할 필요는 없다. 이 미션은 Next.js를 학습하기 위함이 아니라, SSR 방식이 CSR-only 방식에 비해서 어떤 이점을 가지는지 이해하기 위함이다.
