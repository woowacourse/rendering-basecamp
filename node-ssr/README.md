# 🚀 미니 미션 - Node.js 로 Classic SSR 구현하기

Express 서버가 TMDB API에서 영화 데이터를 가져온 뒤 HTML 문자열을 완성해
브라우저에 응답합니다. 브라우저에서 별도의 React 실행이나 TMDB API 요청 없이
첫 HTML에 영화 콘텐츠가 포함됩니다.

## 로컬 실행

```bash
cp .env.example .env
npm ci
npm run dev
```

`.env`에 TMDB Read Access Token을 설정해야 합니다.

```text
TMDB_ACCESS_TOKEN=
```

기본 주소는 `http://localhost:8080`입니다.

- `/`: 인기 영화 목록을 포함한 HTML을 서버에서 생성합니다.
- `/detail/:id`: 영화 상세 모달과 영화별 Open Graph 태그를 포함한 HTML을
  서버에서 생성합니다.
- `/styles`, `/images`: `public` 디렉터리의 정적 리소스를 제공합니다.

## Render 배포

Render Dashboard에서 Web Service를 생성하고 다음 값을 설정합니다.

| 항목 | 설정값 |
| --- | --- |
| Branch | `step2` |
| Root Directory | `node-ssr` |
| Language | `Node` |
| Build Command | `npm ci && npm run build` |
| Start Command | `node dist/server.js` |

Environment에 `TMDB_ACCESS_TOKEN`을 등록한 뒤 배포합니다. 서버는 Render가
주입하는 `PORT`를 사용하며, 로컬에서는 `8080`을 기본값으로 사용합니다.

- 배포 주소: https://rendering-basecamp-binggwa.onrender.com/
- 무료 인스턴스는 일정 시간 요청이 없으면 중지되므로 첫 요청에 콜드 스타트
  시간이 포함될 수 있습니다.
