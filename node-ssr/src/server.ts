import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { moviesApi } from "./service/tmdbApi";
import { renderHomePage, renderDetailPage } from "./render";
import path from "path";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const popular = await moviesApi.getPopular(1);

  res.send(renderHomePage(popular.results));
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Number(rawId);
  const siteUrl = process.env.SITE_URL || "http://localhost:8080";

  if (!/^[0-9]+$/.test(rawId) || !Number.isSafeInteger(id) || id <= 0) {
    res.status(400).send("<h1>올바른 영화 ID가 아닙니다.</h1>");
    return;
  }

  const [{ results }, detailMovie] = await Promise.all([
    moviesApi.getPopular(1),
    moviesApi.getDetail(id),
  ]);

  res.send(renderDetailPage(results, detailMovie, siteUrl));
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
