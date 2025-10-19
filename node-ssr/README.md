# 🚀 미니 미션 - Node.js 로 Classic SSR 구현하기

## 🎯 기능 요구사항

- / 와 /detail/:id url 에서 react-csr 에서와 동일한 화면을 SSR로 반환한다.
- 사용자 인터랙션은 동작하지 않아도 된다.

<br/>

## 💻 프로그래밍 요구사항

- /public 의 html, css 리소스를 기반으로, 구현한다.
- UI 나 디테일한 부분은 신경쓰지 않아도 된다. API endpoint 와 그에 맞는 HTML 응답받는 흐름을 이해한다.
  - 서버 API 개발은 Node.js 라이브러리인 express 를 활용한다.
  - API 내에서 TMDB 를 동적으로 받아오고, 동적으로 html 을 생성해야 한다.
- Railway 로 서버를 무료 배포하여, 결과물을 확인한다.
  - /detail/:id 에서 og tag 가 정상 동작하도록 구현한다.
  - / 에서 FCP 가 개선되었음을 확인한다.

<br/>

### Railway 로 배포하기

- Settings > Root Directory 에서 /node-ssr 을 입력한다.
- Settings > Branch 에서 본인의 작업 브랜치로 변경한다.
- Variable 에서 환경 변수를 등록한다.
- Deploy 후, Settings > Network > Public Domain > Generate Domain 클릭한다.
