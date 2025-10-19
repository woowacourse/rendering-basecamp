import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";

import { moviesApi } from "./service/tmdbApi";
import { generateHTML } from "./generateMovieHTML";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const popularMovies = await moviesApi.getPopular();
  res.send(generateHTML(popularMovies.results));
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const [popularMovies, movieDetail] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(req.params.id)),
  ]);

  res.send(generateHTML(popularMovies.results, movieDetail));
});

app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;

// PR 확인용 주석 (기존 레벨 1때 이 커밋들이 다 merge가 되버려서... 전체 파일로 보시면 됩니다!)
