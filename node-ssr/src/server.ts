import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";

import { movieHTML } from "./util/movieHTML";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const movieData = await moviesApi.getPopular().then((res) => res.results);
  res.send(movieHTML().generate(movieData).build());
});

app.get("/detail/:id", async (_req: Request, res: Response) => {
  const movieData = await moviesApi.getPopular().then((res) => res.results);
  const movieDetailData = await moviesApi.getDetail(Number(_req.params.id));
  res.send(movieHTML().generateWithDetail(movieData, movieDetailData).build());
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
