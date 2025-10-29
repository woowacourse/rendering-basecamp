## 👀 리뷰를 통한 생각 나눔

<!--
  LMS에 단계별로 명시된 질문을 옮겨 와 답변을 작성해 주세요.
-->

### 1. Chrome performance 에서 hydration 이 발생하는 타이밍을 알 수 있도록 로그를 추가해보아요. hydration 이 기록된 Chrome performance 을 캡쳐해서 올려주세요. 그리고 hydration 이 언제 시작하는지, 언제 끝나는지 설명해 보세요.

[Hydration Performance]()

**Hydration 타이밍 분석:**

- **시작 시점 (약 1,615.3ms)**:

  - bundle.js가 다운로드되고 스크립트 평가(실행) 단계에서 `hydrateRoot()` 함수가 호출되는 순간
  - `performance.mark('beforeRender')`로 시작 지점 표시
  - `main.tsx`에서 `hydrateRoot(document.getElementById('root')!, <App ... />)` 실행

- **진행 과정 (약 0.7ms 소요)**:

  - React가 Virtual DOM 생성
  - 서버에서 렌더링된 기존 DOM과 Virtual DOM을 비교 (Reconciliation)
  - **중요**: DOM을 새로 그리지 않고, 기존 DOM을 재사용
  - 기존 DOM 노드에 이벤트 리스너만 연결 (onClick, onChange, useEffect 등)
  - React 내부 상태 관리 시스템 초기화

- **종료 시점 (약 1,615.9ms)**:
  - 모든 이벤트 핸들러 연결 완료
  - `performance.mark('afterHydrate')`로 종료 지점 표시
  - `performance.measure('hydration', 'beforeRender', 'afterHydrate')`로 측정
  - Chrome Performance 탭의 "이벤트 로그"에서 "hydration" 항목으로 확인 가능

**브라우저 실행 관점:**

- Hydration은 bundle.js의 **스크립트 평가(Script Evaluation) 단계 도중**에 발생하고 종료
- 스크립트 평가는 약 24ms 소요되는데, 그 중 hydration은 0.7ms만 차지
- 이후 사용자 인터랙션(버튼 클릭, 스크롤 등)이 가능한 상태가 됨 (TTI)

### 2. 브라우저가 HTML 을 request 하고, 유저 인터랙션이 가능해지는 시점까지의 렌더링 과정을, 이 미션의 코드 흐름/네트워크 흐름/브라우저 렌더링을 동원하여 최대한 상세하게 써보아요 (ex. router('/detail:id', () => {}) 실행, HTML parsing, hydrateRoot 실행 등의 상세 과정이 모두 포함되면 좋습니다.)

#### 1. 네트워크 요청 및 서버 처리

- 사용자가 `https://www.rendering-basecamp.com`으로 접속
- 브라우저가 DNS 조회 → TCP 연결 → HTTP GET 요청 전송
- Express 서버가 `router.get('/', async (req, res) => {...})` 핸들러로 요청 감지
- `moviesApi.getPopular()`로 TMDB API에서 영화 데이터 fetch
- `renderToString(<App initialMovies={...} path="/" />)`로 React 컴포넌트를 서버에서 HTML 문자열로 변환 (SSR)
- `generateOGTags()`로 메타 태그 생성, `getRequestUrl(req)`로 현재 URL 추출
- `window.__INITIAL_DATA__`에 movies와 path를 담은 인라인 스크립트 생성
- HTML 템플릿의 플레이스홀더(<!--{BODY_AREA}-->, <!--{INIT_DATA_AREA}-->, <!--{OG_TAGS}-->)를 실제 내용으로 replace
- 완성된 HTML 문서를 `res.send()`로 브라우저에 전송

#### 2. 브라우저의 HTML 파싱 및 리소스 로드

- 브라우저가 HTML 응답 수신 → 파싱 시작
- `<head>` 내 `<link rel="stylesheet" href="/static/styles/index.css" />` 만남 → CSS 요청 (파싱과 병렬 다운로드)
- `<body>` 파싱 → `<div id="root">`의 서버 렌더링 HTML로 DOM 트리 생성
- `<body>` 끝의 `<script src="/static/bundle.js"></script>` 도달 → bundle.js 요청
- HTML 파싱 완료 (약 997ms), DOM 트리 생성 완료

#### 3. 브라우저 렌더링

- CSS 다운로드 완료 → CSSOM 생성
- DOM + CSSOM 결합 → Render Tree 생성
- Layout(Reflow): 각 요소의 위치와 크기 계산
- Paint: 픽셀을 화면에 그림
- **FCP (First Contentful Paint)**: 사용자가 서버 렌더링된 화면을 봄 (약 1,400ms)
- 이 시점에 화면은 보이지만, JavaScript가 아직 로드 중이므로 버튼 클릭 등 인터랙션은 불가능

#### 4. JavaScript 로드 및 Hydration

- bundle.js 다운로드 완료 (약 1,597ms)
- JavaScript 엔진이 bundle.js 파싱 및 실행 시작 (스크립트 평가)
- import 문 처리 (React, ReactDOM, App 컴포넌트, hooks 등)
- `window.__INITIAL_DATA__`에서 초기 데이터 추출
- `performance.mark('beforeRender')` 실행
- `hydrateRoot(document.getElementById('root')!, <App ... />)` 호출 (약 1,615ms)
  - React가 Virtual DOM 생성
  - 기존 서버 렌더링 DOM과 비교 (Reconciliation)
  - DOM은 재사용하고 이벤트 리스너만 연결 (onClick, onChange 등)
- `performance.mark('afterHydrate')` 실행
- Hydration 완료 (약 0.7ms 소요, 1,615.9ms)
- 스크립트 평가 완료 (약 1,616ms)
- **TTI (Time to Interactive)**: 이제 모든 인터랙션 가능! (버튼 클릭, 모달 열기 등)

### 3. npm run start 를 하면 어떤 일이 벌어지는지 상세하게 쓰세요. bundling 이 어떻게 발생하고, 어떤 결과물이 어떤 구조로 생성되는지 webpack 을 뜯어보며 이해해 보세요.

#### 1. 명령어 실행 흐름

```bash
npm run start
→ "npm run build && node dist/server/server.js"
→ npm run build
   → "rm -rf dist && npm run build:client && npm run build:server"
   → rm -rf dist (기존 빌드 결과물 삭제)
   → npm run build:client (클라이언트 번들링)
   → npm run build:server (서버 번들링)
→ node dist/server/server.js (서버 실행)
```

#### 2. 클라이언트 번들링 (webpack.client.config.js)

**Entry Point:**

- `./src/client/main.tsx` - React 애플리케이션의 시작점

**Webpack 처리 과정:**

1. **모듈 해석 (Module Resolution)**

   - `main.tsx` → `App.tsx` → 모든 컴포넌트, hooks, utils 추적
   - `resolve.extensions: ['.js', '.jsx', '.ts', '.tsx']`로 확장자 자동 해석

2. **트랜스파일 (Babel-loader)**

   - TypeScript → JavaScript (`@babel/preset-typescript`)
   - JSX → JavaScript (`@babel/preset-react`)
   - 최신 JS → ES5+ (`@babel/preset-env`)

3. **CSS 처리 (style-loader + css-loader)**

   - CSS 파일 import → JavaScript 문자열로 변환
   - 런타임에 `<style>` 태그로 DOM에 주입

4. **이미지 처리 (asset/resource)**

   - PNG, JPG 등 → `dist/static/images/[name][ext]`로 복사
   - import한 이미지 경로를 번들에 포함

5. **정적 파일 복사 (CopyPlugin)**
   - `public/images/` → `dist/static/images/`
   - `public/styles/` → `dist/static/styles/`

**Output:**

- **경로**: `dist/static/bundle.js`
- **내용**: React, ReactDOM, App, 모든 컴포넌트가 하나의 파일로 번들링
- **publicPath**: `/static/` (브라우저에서 접근할 URL 경로)

#### 3. 서버 번들링 (webpack.server.config.js)

**Entry Point:**

- `./src/server/main.ts` - Express 서버의 시작점

**Webpack 처리 과정:**

1. **Target: Node.js**

   - `target: 'node'` - Node.js 환경에 최적화
   - `externals: [nodeExternals()]` - node_modules는 번들에서 제외 (런타임에 require)

2. **모듈 해석**

   - `main.ts` → `routes/index.tsx` → `../../client/App.tsx` 등
   - 서버에서도 React 컴포넌트를 import (SSR 위해)

3. **트랜스파일**
   - 클라이언트와 동일한 Babel 설정
   - JSX를 사용하는 서버 코드도 변환 (`renderToString(<App />)`)

**Output:**

- **경로**: `dist/server/server.js`
- **내용**: Express 서버, 라우트 핸들러, React 컴포넌트(SSR용)가 포함된 단일 파일
- **실행**: `node dist/server/server.js`로 바로 실행 가능

#### 4. 최종 결과물 구조

```
dist/
├── server/
│   └── server.js                 # Express 서버 (SSR 로직 포함)
└── static/                       # 정적 파일 (브라우저 접근)
    ├── bundle.js                 # 클라이언트 React 앱 (Hydration용)
    ├── images/                   # 이미지 파일들
    │   ├── logo.png
    │   ├── star_empty.png
    │   └── ...
    └── styles/                   # CSS 파일들
        ├── index.css
        ├── reset.css
        ├── colors.css
        └── ...
```

#### 5. 번들링의 주요 차이점

| 항목             | 클라이언트 번들          | 서버 번들               |
| ---------------- | ------------------------ | ----------------------- |
| **Target**       | 브라우저                 | Node.js                 |
| **Entry**        | `main.tsx`               | `main.ts`               |
| **Output**       | `dist/static/bundle.js`  | `dist/server/server.js` |
| **node_modules** | 모두 포함                | 제외 (externals)        |
| **CSS 처리**     | style-loader (DOM 주입)  | css-loader (무시)       |
| **용도**         | Hydration + 인터랙션     | SSR + API 서버          |
| **크기**         | 더 큼 (모든 의존성 포함) | 작음 (externals 제외)   |

#### 6. 왜 두 개의 번들이 필요한가?

- **서버 번들**: `renderToString(<App />)`로 HTML 생성 (SSR)
- **클라이언트 번들**: `hydrateRoot()`로 이벤트 연결 (Hydration)
- 동일한 React 컴포넌트를 서버와 클라이언트 양쪽에서 실행
- 서버는 HTML 문자열 생성, 클라이언트는 인터랙션 추가

### 4. SSR 은 항상 이점만 있지 않습니다. SSR 의 단점은 무엇인가요? 다양한 측면에서 써 보세요.

#### 1. 성능 측면

- **TTFB (Time To First Byte) 증가**: 서버에서 HTML을 완전히 렌더링한 후 전송하므로, 네트워크가 느리거나 서버 부하가 높으면 첫 바이트 도달이 늦어짐
- **서버 부하**: 매 요청마다 React 컴포넌트를 실행하고 HTML을 생성해야 하므로 서버 CPU/메모리 사용량 증가
- **캐싱 어려움**: 사용자마다 다른 데이터를 보여주는 경우 CDN 캐싱이 어려움

#### 2. 개발 복잡도

- **Hydration Mismatch 관리**: 서버와 클라이언트의 렌더링 결과가 일치해야 함
  - 시간/날짜: 서버와 클라이언트의 타임존이 다를 수 있음
  - 랜덤 값: `Math.random()`, `Date.now()` 등 사용 시 불일치 발생
  - localStorage/sessionStorage: 서버에서는 접근 불가
- **양쪽 환경 고려**: 서버(Node.js)와 브라우저 모두에서 동작하는 코드 작성 필요
  - `window`, `document` 같은 브라우저 전용 API는 서버에서 에러
  - `fs`, `path` 같은 Node.js 전용 모듈은 클라이언트 번들에서 제외 필요

#### 3. 사용자 경험

- **전통적인 SSR (MPA)**: 모든 페이지 전환 시 새로고침 → 깜빡임, 상태 유실
- **Hybrid SSR**: 초기 로딩은 빠르지만 Hydration 전까지 인터랙션 불가능 → "보이지만 클릭 안됨" 현상

#### 4. 배포 및 인프라

- **서버 필수**: 정적 호스팅(GitHub Pages, S3 등) 불가, 서버 인프라 필요 (비용 증가)
- **확장성**: 트래픽 증가 시 서버 스케일링 필요 (vs CSR은 CDN으로 간단 해결)
- **에러 처리**: 서버 에러 시 사용자에게 500 에러 페이지 → CSR보다 복구 어려움

#### 5. 번들 크기

- **중복 코드**: React 컴포넌트가 서버와 클라이언트 번들 모두에 포함 → 총 번들 크기 증가
- **서버 번들**: Express + React SSR 로직 + 컴포넌트 포함

### 5. /detail/:id 페이지에 OG 를 위한 meta tag 가 정상적으로 달려있는 것을 확인하고 캡쳐해서 올려주세요.

### 6. 어려웠던 트러블 슈팅 과정을 써 보세요.

- 라우팅 처리가 고민이었습니다. next.js처럼 자동으로 라우팅해주는 게 제일 좋을 것 같지만 미션에서는 간단하게 path를 넘겨서 라우팅 처리했습니다.
- 브라우저의 뒤로가기 앞으로가기 처리가 어렵지만 재밌었습니다.
  - CustomEvent와 dispatchEvent를 사용하여 뒤로가기/앞으로가기 시 모달이 닫히도록 처리했습니다.

### 7. 논의하고 싶은 것이 있다면 써 주세요.
