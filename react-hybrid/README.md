# 🚀 2단계: React + Node.js 로 Hybrid Rendering 구현하기

## 🎯 기능 요구사항
/ 와 /detail/:id url 에서 react-csr 에서와 동일한 화면을 SSR 로 반환한다.
응답 받은 후, 정상적으로 사이트 이용이 가능하다.

## 💻 프로그래밍 요구사항
Node.js 로 SSR server 를 띄우면서, React 로 만들어진 컴포넌트를 응답하도록 구현한다. react-dom/server 의 renderToString 을 활용하여 구현한다.
응답 받은 후, hydration 과정을 거쳐, CSR 로 동작하도록 구현한다. react-dom/client 의 hydrateRoot 를 활용하여 구현한다
(선택) 배포는 Railway 등 무료 플랫폼을 활용한다.