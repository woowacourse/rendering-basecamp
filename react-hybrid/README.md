# 🚀 2단계: React + Node.js 로 Hybrid Rendering 구현하기

## 구현 내용

- **SSR (Server-Side Rendering)**: Node.js + Express 서버에서 React 컴포넌트를 HTML로 렌더링
- **Hydration**: 클라이언트에서 `hydrateRoot`를 사용하여 서버에서 렌더링된 HTML을 상호작용 가능하게 만듦
- **라우팅**: React Router를 사용하여 `/`와 `/detail/:id` 경로 지원

## 주요 구현 파일

### 서버 측 (SSR)
- `src/server/routes/index.tsx`: 서버에서 데이터를 가져와 HTML을 생성하고 초기 데이터를 전달

### 클라이언트 측 (CSR + Hydration)
- `src/client/main.tsx`: `hydrateRoot`를 사용하여 hydration 수행
- `src/client/hooks/queries/usePopularMovies.ts`: SSR 데이터를 사용하여 API 호출 생략

## 실행 방법

```bash
# 의존성 설치
npm install

# 빌드 및 실행
npm start

# 개발 모드 (watch 모드)
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

## 배포

- 🚀 [배포 링크](https://rendering-basecamp-production-ed58.up.railway.app/)

## 환경 변수

`.env` 파일에 TMDB ACCESS TOKEN을 설정해야 합니다:

```
TMDB_ACCESS_TOKEN=your_token_here
```

---

## 🧠 셀프 리뷰

### 1. Chrome performance에서 hydration 발생 타이밍

**구현 코드:**
```typescript
performance.mark("beforeRender");
hydrateRoot(document.getElementById("root")!, <App />);
performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");
```

**설명:**
- `beforeRender`: React의 `hydrateRoot` 호출 직전
- `afterHydrate`: React가 서버에서 렌더링된 HTML에 이벤트 리스너를 연결한 직후
- Hydration 지속 시간: 약 10-20ms (초기 렌더링의 약 1/100)

### 2. 브라우저 렌더링 과정 (요청 → 인터랙션 가능)

#### 네트워크 흐름
1. 브라우저가 `GET /` 요청
2. Express 서버 (`src/server/routes/index.tsx`) 실행:
   - TMDB API 호출하여 영화 목록 가져오기
   - HTML 템플릿 생성 및 `window.__INITIAL_DATA__`에 데이터 삽입
   - HTML 응답
3. 브라우저가 HTML 수신

#### HTML 파싱
1. `<link rel="stylesheet">` 발견 → CSS 파일 다운로드
2. `<div id="root">` 렌더링 (빈 div)
3. `<script>window.__INITIAL_DATA__ = {...}` 실행 → 전역 변수에 데이터 저장
4. `<script src="/static/bundle.js">` 발견 → JavaScript 다운로드

#### JavaScript 실행 및 Hydration
1. `main.tsx` 진입점 실행
2. `hydrateRoot` 호출
3. `BrowserRouter` 초기화
4. `App` 컴포넌트 렌더링
5. `Routes`와 `Route` 매칭 (`/` 경로 → `MovieHomePage`)
6. `usePopularMovies` 훅 실행 → SSR 데이터(`initialMovies`) 사용
7. **Hydration 완료**: 서버 HTML에 이벤트 리스너 연결

#### 인터랙션 가능
- 버튼 클릭, 링크 이동 등 모든 기능 활성화
- 클라이언트 라우팅 동작 (`Link` 클릭 시 페이지 새로고침 없이 이동)

### 3. npm run start 실행 과정

#### 빌드 단계
```bash
npm run build
├── rm -rf dist  # 이전 빌드 삭제
├── npm run build:client  # 클라이언트 번들 생성
└── npm run build:server  # 서버 번들 생성
```

**클라이언트 빌드** (`webpack.client.config.js`):
- Entry: `src/client/main.tsx`
- Output: `dist/static/bundle.js` (1.62 MB)
- CopyPlugin: `public/images`, `public/styles` → `dist/static/`
- 결과물:
  ```
  dist/static/
  ├── bundle.js
  ├── images/
  └── styles/
  ```

**서버 빌드** (`webpack.server.config.js`):
- Entry: `src/server/main.ts`
- Output: `dist/server/server.js` (14.8 KB)
- Target: `node`
- Externals: React Router 제외
- 결과물:
  ```
  dist/server/
  └── server.js
  ```

#### 서버 실행
```bash
node dist/server/server.js
```
1. `dotenv.config()` → `.env` 로드
2. Express 서버 초기화
3. 정적 파일 미들웨어 등록
4. 라우터 등록
5. `PORT` 리스닝 시작

### 4. SSR의 단점

1. **서버 부하 증가**: 모든 요청마다 서버에서 렌더링
2. **복잡한 상태 관리**: 클라이언트/서버 상태 동기화 필요
3. **초기 응답 시간 증가**: API 호출 + 렌더링 시간 소요
4. **개발 복잡도 증가**: Webpack 설정, 디버깅 어려움
5. **HTTP 캐싱 어려움**: 동적 콘텐츠 캐싱 제한
6. **SEO vs 성능 트레이드오프**: SEO 개선 vs 서버 리소스 사용

### 5. OG Meta 태그

**현재 상태:** ❌ 구현 안 됨

**추가 필요:**
```typescript
router.get("/detail/:movieId", async (req, res) => {
  const detail = await tmdbClient.get(`/movie/${movieId}`);
  
  const ogTags = `
    <meta property="og:title" content="${detail.data.title}" />
    <meta property="og:description" content="${detail.data.overview}" />
    <meta property="og:image" content="https://image.tmdb.org/t/p/w500${detail.data.poster_path}" />
  `;
});
```

### 6. 트러블 슈팅

#### 문제 1: 정적 파일 404 에러
- **원인**: 서버 경로가 잘못됨
- **해결**: `path.resolve()` 사용하여 절대 경로로 변경

#### 문제 2: React Router 서버 번들 오류
- **원인**: `createBrowserRouter`가 서버 번들에 포함
- **해결**: webpack externals에 React Router 추가

#### 문제 3: path-to-regexp 에러
- **원인**: 와일드카드 라우트(`*`) 사용
- **해결**: 구체적인 라우트(`/`, `/detail/:movieId`)로 변경

#### 문제 4: Railway 배포 실패
- **원인**: 포트 하드코딩
- **해결**: `process.env.PORT` 사용

### 7. 논의하고 싶은 것

1. **Hydration 성능 최적화**: 초기 HTML에 최소한의 데이터만 포함
2. **스트리밍 SSR**: React 18의 `renderToPipeableStream` 사용
3. **서버 캐싱**: TMDB API 응답 캐싱
4. **에러 바운더리**: 서버/클라이언트 에러 처리 전략
