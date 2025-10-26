import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import movieRouter from "./routes/index";

const app = express();
const PORT = 3000;

app.use("/static", express.static(path.join(__dirname, "../../dist/static")));

app.use("/", movieRouter);

app.listen(PORT, () => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
