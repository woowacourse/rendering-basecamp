# 🚀 3단계: React + Node.js로 Hybrid Rendering 구현하기

Node.js 서버가 React 컴포넌트를 HTML로 렌더링하고, 브라우저가 같은 초기 데이터로 hydration한 뒤 CSR로 동작하는 애플리케이션입니다.

## 로컬 실행

```bash
npm ci
cp .env.example .env
npm run start
```

`.env`에 TMDB API 토큰을 설정합니다.

```text
TMDB_ACCESS_TOKEN=
```

기본 접속 주소는 `http://localhost:3000`입니다.

- `/`: 인기 영화 홈 화면
- `/detail/:id`: 영화 상세 모달과 Open Graph 메타데이터가 포함된 화면
- `/api/movies/:id`: hydration 이후 브라우저가 사용하는 영화 상세 API

## 빌드 구조

`npm run start`는 다음 순서로 실행됩니다.

1. 기존 `dist` 디렉터리를 제거합니다.
2. `webpack.client.config.js`로 브라우저 번들을 생성합니다.
3. `webpack.server.config.js`로 Node.js 서버 번들을 생성합니다.
4. `node dist/server/server.js`로 Express 서버를 시작합니다.

빌드 결과는 다음과 같이 나뉩니다.

```text
dist/
├── server/
│   └── server.js       # Express와 React SSR 로직
└── static/
    ├── bundle.js       # hydration 및 이후 CSR 로직
    ├── images/
    └── styles/
```

서버 번들은 요청마다 TMDB 데이터를 조회하고 `renderToString`으로 HTML을 만듭니다. 브라우저 번들은 HTML에 직렬화된 `window.__INITIAL_DATA__`를 읽어 `hydrateRoot`에 전달합니다.

## Render 배포

Web Service를 생성한 뒤 다음 값을 설정합니다.

| 항목 | 값 |
| --- | --- |
| Branch | `step3` |
| Root Directory | `react-hybrid` |
| Language | `Node` |
| Build Command | `npm ci && npm run build` |
| Start Command | `node dist/server/server.js` |
| Environment Variable | `TMDB_ACCESS_TOKEN` |

배포가 끝나면 `/`와 `/detail/:id` 응답, 상세 페이지의 OG 미리보기, Chrome Performance의 `hydration` 구간을 확인합니다.
