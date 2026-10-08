import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { MovieHome } from "./components/MovieHome";
import { MovieDetailPage } from "./components/MovieDetailPage";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.set("trust proxy", 1);

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const { results: movies } = await moviesApi.getPopular();
  const featuredMovie = movies[0];

  if (!featuredMovie) {
    res.status(502).send("영화 정보를 불러오는데 실패했습니다.");
    return;
  }

  res.send(MovieHome(movies));
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    res.status(404).send("영화를 찾을 수 없습니다.");
    return;
  }

  const { results: movies } = await moviesApi.getPopular();
  const movieDetail = await moviesApi.getDetail(movieId);

  if (!movies[0]) {
    res.status(502).send("영화 정보를 불러오는데 실패했습니다.");
    return;
  }

  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
    : `${req.protocol}://${req.get("host")}/images/no_image.png`;

  const ogTags = `
    <meta property="og:title" content="${movieDetail.title}" />
    <meta property="og:description" content="${movieDetail.overview}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${req.protocol}://${req.get("host")}/detail/${movieId}" />
  `;

  const pageHtml = MovieDetailPage(movies, movieDetail, ogTags);
  res.send(pageHtml);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, "0.0.0.0", (): void => {
  console.log(`🌟 서버가 ${PORT} 포트에서 실행 중입니다.`);
});

export default app;
