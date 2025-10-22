# 🚀 미니 미션 - Node.js 로 Classic SSR 구현하기

## 🕵️ 셀프 리뷰

### 제출 전 체크 리스트

- [x] 기능 요구 사항을 모두 구현했고, 정상적으로 동작하는지 확인했나요?
- [x] 배포한 데모 페이지에 정상적으로 접근할 수 있나요?
  - 배포 링크 기입: **\_\_**

## 🧠 리뷰를 통한 생각 나눔

<details>
<summary>1. 성능 개선 - Chrome performance 에서 Slow 4G 기준 FCP 를 측정하고, 전후 결과를 비교한다.</summary>

- CSR의 경우:
  1. HTML 다운로드
  2. JS 다운로드
  3. JS 실행
  4. API 요청
  5. 데이터 수신
  6. 렌더링
- SSR의 경우:
  1. 서버에서 API 요청
  2. 서버에서 HTML 생성
  3. 완성된 HTML 다운로드
  4. 즉시 렌더링

SSR이 FCP가 더 빠른 이유는 브라우저가 받는 즉시 렌더링할 수 있는 HTML을 서버에서 전달하기 때문입니다.

</detials>

<details>
<summary>2. Open Graph Tag 개선 - `/detail/:id` 를 공유했을 때, 영화 상세 정보가 보이는지 확인한다.</summary>

CSR의 경우 초기 HTML에 OG 태그가 없어 SNS 공유 시 정보가 표시되지 않지만, SSR의 경우 서버에서 동적으로 OG 태그를 생성하여 전달하므로 SNS 공유 시 영화 정보가 올바르게 표시됩니다.

</detials>

<details>
<summary>3. 어려웠던 트러블 슈팅 과정을 써 보세요.</summary>

1. 템플릿 관리

   - 문제: HTML 문자열을 관리하기 어려움
   - 해결: 템플릿 함수를 별도 파일로 분리하고 재사용 가능한 컴포넌트 형태로 구성

2. 타입 안정성
   - 문제: API 응답 데이터의 타입 관리
   - 해결: CSR 프로젝트의 타입 정의를 재사용하여 타입 안정성 확보

</detials>

<details>
<summary>4. 논의하고 싶은 것이 있다면 써 주세요.</summary>

</detials>
