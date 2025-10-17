import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { getIndexHtml } from "./html";
import { getDetailHtml } from "./html/detail";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const indexHtml = await getIndexHtml();
  res.send(indexHtml);
});
app.get("/detail/:movieId", async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const detailHtml = await getDetailHtml(Number(movieId));
  res.send(detailHtml);
});

app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
