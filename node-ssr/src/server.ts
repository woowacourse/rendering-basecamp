import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import {
  renderHomePage,
  renderMovieDetailModal,
  renderMovieMetadata,
} from "./views";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const moviesResponse = await moviesApi.getPopular();
  const movies = moviesResponse.results;

  if (movies.length === 0) {
    res.status(502).send("영화 정보를 불러오지 못했습니다.");
    return;
  }

  res.send(renderHomePage(movies));
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).send("올바르지 않은 영화 ID입니다.");
    return;
  }

  const [popularResponse, movie] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(id),
  ]);

  if (popularResponse.results.length === 0) {
    res.status(502).send("영화 정보를 불러오지 못했습니다.");
    return;
  }

  const modalHtml = renderMovieDetailModal(movie);
  const origin = `${req.protocol}://${req.get("host")}`;
  const metadataHtml = renderMovieMetadata(
    movie,
    origin,
    `${origin}${req.originalUrl}`,
  );

  res.send(renderHomePage(popularResponse.results, modalHtml, metadataHtml));
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
