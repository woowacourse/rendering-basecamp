import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { renderPage } from "./templates";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  try {
    const popularMovies = await moviesApi.getPopular();
    res.send(renderPage(popularMovies));
  } catch (error) {
    res.status(500).json({ error: "API 호출 실패" });
  }
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);

  if (!Number.isInteger(movieId) || movieId < 0) {
    res.status(400).send("잘못된 영화 ID입니다.");
    return;
  }

  try {
    const [popularMovies, movieDetail] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    res.send(renderPage(popularMovies, movieDetail));
  } catch (error) {
    res.status(500).json({ error: "API 호출 실패" });
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
