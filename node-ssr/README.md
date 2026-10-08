# 🚀 미니 미션 - Node.js 로 Classic SSR 구현하기

# **⛳️ 학습 목표**

- SSR 의 기본 원리가 되는 Server 를 이해한다.
- SSR 이 왜 성능이 빠른지, 왜 SEO 가 좋은지 이해한다.

## **미션 소개**

- 미션 저장소

## **✍️ 진행 방식**

- 이번 미션은 개인 미션입니다.
- 리뷰어는 구현된 것을 확인만 하고 Merge 해주세요. 코드리뷰를 필수적으로 남길 필요는 없습니다. 간단한 미션이니 빠르게 Merge 합니다.

## **🎯 기능 요구사항**

- `/` 와 `/detail/:id` url 에서 react-csr 에서와 동일한 화면을 SSR 로 반환한다.
- 사용자 인터랙션은 동작하지 않아도 된다.

## **💻 프로그래밍 요구사항**

- `/public` 의 html, css 리소스를 기반으로, 구현한다.
- UI 나 디테일한 부분은 신경쓰지 않아도 된다. API endpoint 와 그에 맞는 HTML 응답받는 흐름을 이해한다.
    - 서버 API 개발은 Node.js 라이브러리인 express 를 활용한다.
    - API 내에서 TMDB 를 동적으로 받아오고, 동적으로 html 을 생성해야 한다.
- Railway 등을 활용하여 서버를 무료 배포하여, 결과물을 확인한다.
    - `/detail/:id` 에서 og tag 가 정상 동작하도록 구현한다.
    - `/` 에서 FCP 가 개선되었음을 확인한다.

### **Railway 로 배포 하기**

- Settings > Root Directory 에서 /node-ssr 을 입력한다.
- Settings > Branch 에서 본인의 작업 브랜치로 변경한다.
- Variable 에서 환경 변수를 등록한다.
- Deploy 후, Settings > Network > Public Domain > Generate Domain 클릭한다.

### **.env 환경변수**

```
// react-csr
VITE_TMDB_ACCESS_TOKEN=

// node-ssr
TMDB_ACCESS_TOKEN=
```

## **PR Template**

```
## 🕵️ 셀프 리뷰

### 제출 전 체크 리스트
- [ ] 기능 요구 사항을 모두 구현했고, 정상적으로 동작하는지 확인했나요?
- [ ] 배포한 데모 페이지에 정상적으로 접근할 수 있나요?
    - 배포 링크 기입: **\_\_**

## 🧠 리뷰를 통한 생각 나눔
1. 성능 개선 - Chrome performance 에서 Slow 4G 기준 FCP 를 측정하고, 전후 결과를 비교한다.

2. Open Graph Tag 개선 - `/detail/:id` 를 공유했을 때, 영화 상세 정보가 보이는지 확인한다.

3. 어려웠던 트러블 슈팅 과정을 써 보세요.

4. 논의하고 싶은 것이 있다면 써 주세요.
```
