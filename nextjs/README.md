# 🚀 1단계 Next.js 로 Hybrid Rendering 구현하기

# **⛳️ 학습 목표**

- Next.js 를 활용하여, SSR 의 이점을 빠르게 이해하는 것을 목표로 한다.
- Next.js 라는 기술 자체에 매몰되지 않는다.

## **미션 소개**

- 미션 저장소

## **✍️ 진행 방식**

- 이번 미션은 개인 미션입니다.
- 예제 프로젝트를 fork 받아 각자 개선 작업을 진행하신 뒤, PR을 보내주세요.
- PR 제출시 답변을 작성해 리뷰어에게 자신의 생각을 드러내 주세요.
- 리뷰어는 리뷰이가 제출한 PR을 리뷰해주세요.
  - PR 질문이 많습니다. PR 작성 시간을 고려해서 제출하세요

## **🎯 기능 요구사항**

- `/react-csr` 은 영화 리뷰 미션를 CSR 로 구현한 것이다. 이 기능을 그대로 하며, 아래 시나리오에 맞게 Next.js (`/nextjs`)로 개선한다.
- 성능 시나리오
  - `/` 홈 화면 Fast 4G 기준 LCP 가 4초이다. LCP 를 3초까지 개선하면, 이탈율이 10% 감소하여, 신규 유저 유입을 더 늘릴 수 있을 것이다.
- open graph (og) tag 시나리오
  - 영화를 친구에게 공유해도, 영화 제목과 이미지가 미리보기로 뜨지 않는다. 디자이너는 유저 경험을 개선하기 위해서, 미리보기에 영화 제목과 이미지가 나오길 원한다.
- SEO 시나리오 (선택 미션)
  - `/detail/:id` 상세 페이지가 구글에 검색되지 않는다. 구글에 검색된다면, 유입을 늘릴 수 있을 것이다. 팀 내에서 SEO 를 기반으로, 유입을 늘리는 전략을 택하려고 한다.

## **💻 프로그래밍 요구사항**

- `/react-csr` 코드를 그대로 `/nextjs` 로 마이그레이션 한다.
- 배포는 vercel 로 진행한다.
- Next.js 에서 아래 개념들을 학습하고 적용한다.
  - getServerSideProps(https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props)
  - page router 가 사용하는 file-system based router(https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts)
  - head 에 meta tag 주입하는 방법(https://nextjs.org/docs/pages/api-reference/components/head)
- 이외의 개념을 크게 학습할 필요는 없다. 이 미션은 Next.js 를 학습하기 위함이 아니라, SSR 방식이 CSR-only 방식에 비해서 어떤 이점을 가지는지 이해하기 위함이다.

### **app router 가 아닌 page router 를 사용하는 이유**

- app router 는 RSC(React Server Component)를 활용하는 최신 방법입니다.
- SSR 을 모르고 Server Component 를 이해할 수 없습니다. SSR 은 서버에서 Page 단위로 렌더링 하는 방법이고, RSC 는 서버에서 컴포넌트 단위로 렌더링 하는 방법입니다.
- app router 는 방식이 많이 달라져서, 처음 배우기 어색합니다. 근본에 집중하기 어렵습니다.
- 그러므로 순수하게 SSR 을 사용하는, page router 로 먼저 학습합니다. 그 후에야 RSC 를 이해할 수 있고, 원하면 app router 를 사용해보시면 됩니다.

## **.env 환경변수**

```
// react-csr
VITE_TMDB_ACCESS_TOKEN=

// nextjs
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=
```

## **PR Template**

```
## 🕵️ 셀프 리뷰

### 제출 전 체크 리스트
- [ ] 기능 요구 사항을 모두 구현했고, 정상적으로 동작하는지 확인했나요?
- [ ] 배포한 데모 페이지에 정상적으로 접근할 수 있나요?  
    - 배포 링크 기입: **\_\_**

## 🧠 리뷰를 통한 생각 나눔
1. 성능 개선 - Chrome performance 에서 Fast 4G 기준 LCP 를 측정하고, 전후 결과를 비교한다.

2. Open Graph Tag 개선 - `/detail/:id` 를 공유했을 때, 영화 상세 정보가 보이는지 확인한다.

3. [선택] SEO 개선 - 사이트 페이지 하나하나가 검색 결과로 나오는지 확인한다.

4. 유저가 사이트에 접속했을 때, 브라우저가 HTML 을 요청하는 것부터 시작하여, 유저가 정상적으로 인터랙션을 하기까지의 과정을 시퀀스 다이어그램으로 표현하고 설명해보아요. SSR 와 CSR 모두 그림과 설명이 필요합니다. (Browser, S3, SSR Server, TMDB Server 등의 요소를 활용하여 표현합니다.)

5. 위 그림을 참고하여, SSR 이 CSR 에 비해 로딩 성능이 더 빠른 이유를 써보아요.

6. SSR 은 동적 컨텐츠를 검색 엔진에 등록할 수 있고, CSR 은 그게 어려운 이유를 써보아요.

7. 어려웠던 트러블 슈팅이 있었다면 써 보세요.8. 논의하고 싶은 것이 있다면 써 주세요.
```
