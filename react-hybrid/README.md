# 🚀 2단계: React + Node.js 로 Hybrid Rendering 구현하기

Express 서버가 요청마다 TMDB 데이터를 조회해 `renderToString` 으로 React 앱을 HTML 로 만들고, 브라우저에서는 같은 데이터(`window.__INITIAL_DATA__`)로 `hydrateRoot` 를 실행해 CSR 로 이어서 동작합니다.

- `/` : 인기 영화 목록
- `/detail/:id` : 인기 영화 목록 + 영화 상세 모달, 영화별 OG 메타 태그
- `/api/movies/:id` : 하이드레이션 이후 클라이언트가 영화 상세를 조회하는 API (TMDB 토큰은 서버에만 존재)

## 로컬 실행

```sh
cp .env.example .env
# .env 의 TMDB_ACCESS_TOKEN 에 TMDB 읽기 액세스 토큰을 입력
npm ci
npm run start   # production 빌드 후 http://localhost:3000 실행
npm run dev     # development 빌드 watch + 서버 자동 재시작
```

## 배포 (Railway)

- Root Directory: `react-hybrid`
- Build Command: `npm run build`
- Start Command: `node dist/server/server.js`
- Variables: `TMDB_ACCESS_TOKEN` (`PORT` 는 Railway 가 주입)
