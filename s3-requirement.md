# 🚀 3단계: React + Node.js로 Hybrid Rendering 구현하기

> 영화 정보 구현하기
>
> 출처: [LMS+ 미션 페이지](https://techcourse-lms-plus-web.woowahan.com/missions/51?step=499)

## ⛳️ 학습 목표

- React 기반의 앱을 SSR 방식으로 렌더링하고, 이후에 CSR로 동작하도록 구현할 수 있다.

## 📕 미션 소개

- [미션 저장소](https://github.com/woowacourse/rendering-basecamp)

## ✍️ 진행 방식

- 이번 미션은 개인 미션입니다.
- 예제 프로젝트를 fork 받아 각자 개선 작업을 진행하신 뒤, PR을 보내주세요.
- PR 제출 시 답변을 작성해 리뷰어에게 자신의 생각을 드러내 주세요.
- 리뷰어는 리뷰이가 제출한 PR을 리뷰해주세요.
  - PR 질문이 많습니다. 시간을 잘 분배해서 제출하세요.

## 🎯 기능 요구사항

- `/`와 `/detail/:id` URL에서 `react-csr`과 동일한 화면을 SSR로 반환한다.
- 응답을 받은 후, 정상적으로 사이트를 이용할 수 있다.

## 💻 프로그래밍 요구사항

- Node.js로 SSR 서버를 띄우면서, React로 만들어진 컴포넌트를 응답하도록 구현한다.
  - [`react-dom/server`의 `renderToString`](https://ko.react.dev/reference/react-dom/server/renderToString)을 활용한다.
- 응답을 받은 후, hydration 과정을 거쳐 CSR로 동작하도록 구현한다.
  - [`react-dom/client`의 `hydrateRoot`](https://ko.react.dev/reference/react-dom/client/hydrateRoot)를 활용한다.
- 배포는 [Railway](https://railway.com/) 등 무료 플랫폼을 활용한다.

## 🔑 .env 환경변수

```bash
# react-csr
VITE_TMDB_ACCESS_TOKEN=

# react-hybrid
TMDB_ACCESS_TOKEN=
```

## 💡 추가 가이드

- 미션이 어렵게 느껴질 수 있습니다. 큰 구조만 이해하면 구현해야 할 코드는 많지 않습니다.
- 한 번에 많은 것을 구현하려고 하지 말고, 가장 작은 단위부터 동작시켜 보며 hybrid rendering이 어떻게 구현되는지 이해해 보세요.

## 🔗 References

- [프레임워크 없이 만드는 SSR](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Server-Side-Rendering/)

## 📝 PR Template

````markdown
## 🕵️ 셀프 리뷰

### 제출 전 체크 리스트

- [ ] 기능 요구 사항을 모두 구현했고, 정상적으로 동작하는지 확인했나요?
- [ ] 배포한 데모 페이지에 정상적으로 접근할 수 있나요? (선택)
  - 배포 링크 기입:

## 🧠 리뷰를 통한 생각 나눔

1. Chrome Performance 탭에서 hydration이 발생하는 타이밍을 알 수 있도록 로그를 추가해 보아요. hydration이 기록된 Chrome Performance 화면을 캡처해서 올려주세요. 그리고 hydration이 언제 시작하고, 언제 끝나는지 설명해 보세요.

   ```js
   performance.mark('beforeRender');
   hydrateRoot(document.getElementById('root'), <App />);
   performance.mark('afterHydrate');
   performance.measure('hydration', 'beforeRender', 'afterHydrate');
   ```

2. 브라우저가 HTML을 요청하고 유저 인터랙션이 가능해지는 시점까지의 렌더링 과정을, 이 미션의 코드 흐름 / 네트워크 흐름 / 브라우저 렌더링을 동원하여 최대한 상세하게 써 보아요. (예: `router('/detail/:id', () => {})` 실행, HTML 파싱, `hydrateRoot` 실행 등의 상세 과정이 모두 포함되면 좋습니다.)

3. `npm run start`를 하면 어떤 일이 벌어지는지 상세하게 쓰세요. 번들링이 어떻게 일어나고, 어떤 결과물이 어떤 구조로 생성되는지 webpack을 뜯어보며 이해해 보세요.

4. SSR은 항상 이점만 있지 않습니다. SSR의 단점은 무엇인가요? 다양한 측면에서 써 보세요.

5. `/detail/:id` 페이지에 OG를 위한 meta 태그가 정상적으로 달려 있는 것을 확인하고 캡처해서 올려주세요.

6. 어려웠던 트러블 슈팅 과정을 써 보세요.

7. 논의하고 싶은 것이 있다면 써 주세요.
````
