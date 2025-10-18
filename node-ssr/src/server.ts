import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { homeTemplate } from "./templates/home";
import { detailTemplate } from "./templates/detail";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const { results } = await moviesApi.getPopular();

  const topRatedMovie = results[0];
  const popularMovies = results;

  res.send(homeTemplate({ topRatedMovie, popularMovies }));
});

app.get("/detail/:movieId", async (req: Request, res: Response) => {
  const {
    params: { movieId },
  } = req;

  const { results } = await moviesApi.getPopular();
  const movieData = await moviesApi.getDetail(Number(movieId));

  res.send(
    detailTemplate({
      movie: movieData,
      topRatedMovie: results[0],
      popularMovies: results,
    })
  );
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
