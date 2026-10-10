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

## Railway 배포

1. Root Directory를 `/node-ssr`로 지정합니다.
2. 배포 브랜치를 작업 브랜치로 지정합니다.
3. `TMDB_ACCESS_TOKEN` 환경변수를 등록합니다.
4. 배포 후 Public Domain을 생성합니다.

서버는 Railway가 주입하는 `PORT`를 사용하며, 로컬에서는 `8080`을 기본값으로
사용합니다.
