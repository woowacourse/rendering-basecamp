// import 문은 호이스팅되므로 dotenv.config() 호출이 아닌 첫 import 로 환경 변수를 불러온다.
// (그래야 routes → api/tmdb 모듈이 평가될 때 TMDB_ACCESS_TOKEN 이 채워져 있다.)
import "dotenv/config";

import express from "express";
import path from "path";

import movieRouter from "./routes/index";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// webpack 번들(dist/server/server.js) 기준이 아닌, 실행 위치(프로젝트 루트) 기준으로 정적 파일 경로를 잡는다.
const STATIC_DIR = path.resolve(process.cwd(), "dist/static");

// Railway 등 프록시 뒤에서 실행될 때 og:url 의 프로토콜을 올바르게 만들기 위해 설정한다.
app.set("trust proxy", true);

app.use("/static", express.static(STATIC_DIR));
// 컴포넌트에서 사용하는 /images/... 경로를 위해 루트에서도 정적 파일을 제공한다.
app.use(express.static(STATIC_DIR, { index: false }));

app.use("/", movieRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
