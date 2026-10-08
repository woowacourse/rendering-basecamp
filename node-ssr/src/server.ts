import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import moviesRouter from "./routes/movies";

const app = express();
const PORT = Number(process.env.PORT ?? 8080);

// Railway 같은 프록시 뒤에서도 req.protocol 이 실제 프로토콜(https)이 되도록 X-Forwarded-* 헤더를 신뢰한다.
app.set("trust proxy", true);

app.use(express.json());

app.use(moviesRouter);

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
