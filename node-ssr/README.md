# 🚀 미니 미션 - Node.js 로 Classic SSR 구현하기

Express가 요청마다 TMDB 데이터를 조회하고, `public`의 HTML 템플릿에 넣어 반환합니다.
`/`는 인기 영화 목록, `/detail/:id`는 홈 화면과 영화 상세 모달을 반환합니다.
상세 응답의 최초 HTML에는 영화별 Open Graph 태그가 포함됩니다.

## 로컬 실행

`node-ssr/.env`에 `TMDB_ACCESS_TOKEN`을 설정한 뒤 실행합니다.

```bash
npm ci
npm run dev
```

기본 주소는 `http://localhost:8080`입니다. 프로덕션 실행은 `npm run build` 후
`node dist/server.js`를 사용합니다.

## Render 배포

Static Site가 아닌 **Web Service**를 생성합니다.

| 항목 | 값 |
| --- | --- |
| Repository | `vlmbuyd/rendering-basecamp` |
| Branch | `step2` |
| Root Directory | `node-ssr` |
| Language | Node |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `node dist/server.js` |
| Instance Type | Free |
| Environment Variable | `TMDB_ACCESS_TOKEN` |

서버는 배포 환경의 `PORT`를 사용합니다. `SITE_URL`은 선택 사항으로, 설정하면
canonical 및 OG URL의 기준 주소로 사용합니다. 예: `https://서비스이름.onrender.com`.

배포 후 `/`와 `/detail/969681`을 직접 열어 확인합니다. 상세 응답의 HTML에서
`og:title`, `og:description`, `og:image`, `og:url`을 확인하고 실제 공유 미리보기를 검증합니다.

## 성능 확인

CSR은 프로덕션 빌드의 Vite preview, SSR은 빌드한 Node 서버로 측정합니다.
동일한 Chrome 시크릿 창, 화면 크기, Slow 4G, CPU 제한 없음, 캐시 비활성화 조건에서
Performance의 Record and reload로 각각 3회 측정하고 FCP 중앙값을 비교합니다.

SSR은 제공된 CSS를 순서대로 합쳐 HTML에 포함해 CSS 추가 요청을 제거합니다.
`Server-Timing` 헤더의 `tmdb`는 서버에서 영화 API를 기다린 시간(ms)입니다.
FCP와 실제 영화 콘텐츠가 표시되는 시점은 구분해서 해석합니다.

Render 무료 서버의 유휴 후 재시작 지연은 로컬 성능 비교 결과와 별도로 기록합니다.
