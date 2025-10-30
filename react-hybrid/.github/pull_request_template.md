## 👀 리뷰를 통한 생각 나눔

<!--
  LMS에 단계별로 명시된 질문을 옮겨 와 답변을 작성해 주세요.
-->

## 🕵️ 셀프 리뷰

### 제출 전 체크 리스트
- [ ] 기능 요구 사항을 모두 구현했고, 정상적으로 동작하는지 확인했나요?
- [ ] 배포한 데모 페이지에 정상적으로 접근할 수 있나요? (선택)
  - 배포 링크 기입: __

<br/>

## 🧠 리뷰를 통한 생각 나눔

1. Chrome performance 에서 hydration 이 발생하는 타이밍을 알 수 있도록 로그를 추가해보아요. hydration 이 기록된 Chrome performance 을 캡쳐해서 올려주세요. 그리고 hydration 이 언제 시작하는지, 언제 끝나는지 설명해 보세요.

```
performance.mark('beforeRender');
hydrateRoot(document.getElementById("root"), <App />);
performance.mark('afterHydrate');
performance.measure('hydration', 'beforeRender', 'afterHydrate');
```

2. 브라우저가 HTML 을 request 하고, 유저 인터랙션이 가능해지는 시점까지의 렌더링 과정을, 이 미션의 코드 흐름/네트워크 흐름/브라우저 렌더링을 동원하여 최대한 상세하게 써보아요 (ex. router('/detail:id', () => {}) 실행, HTML parsing, hydrateRoot 실행 등의 상세 과정이 모두 포함되면 좋습니다.)

3. npm run start 를 하면 어떤 일이 벌어지는지 상세하게 쓰세요. bundling 이 어떻게 발생하고, 어떤 결과물이 어떤 구조로 생성되는지 webpack 을 뜯어보며 이해해 보세요.

4. SSR 은 항상 이점만 있지 않습니다. SSR 의 단점은 무엇인가요? 다양한 측면에서 써 보세요.

5. /detail/:id 페이지에 OG 를 위한 meta tag 가 정상적으로 달려있는 것을 확인하고 캡쳐해서 올려주세요.

6. 어려웠던 트러블 슈팅 과정을 써 보세요.

7. 논의하고 싶은 것이 있다면 써 주세요.
