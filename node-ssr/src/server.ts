import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { indexPage } from "./routes/indexPage";
import path from "path";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", indexPage);

app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
