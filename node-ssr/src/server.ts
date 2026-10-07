import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import {
  renderHome,
  renderHtml,
  renderModal,
  renderOpenGraph,
} from "./render";
import { moviesApi } from "./service/tmdbApi";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  const { results: movies } = await moviesApi.getPopular();
  const html = renderHtml(
    "영화 리뷰",
    renderHome(movies),
    renderOpenGraph({
      type: "website",
      title: "영화 리뷰",
      description: "인기 영화를 한눈에 확인해보세요.",
      image: movies[0].poster_path
        ? `https://image.tmdb.org/t/p/w780${movies[0].poster_path}`
        : undefined,
    }),
  );

  res.send(html);
});

app.get("/detail/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [{ results: movies }, movieDetail] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(id)),
  ]);

  const html = renderHtml(
    `${movieDetail.title} - 영화 리뷰`,
    renderHome(movies) + renderModal(movieDetail),
    renderOpenGraph({
      title: movieDetail.title,
      description: movieDetail.overview || "영화 상세 정보",
      image: movieDetail.poster_path
        ? `https://image.tmdb.org/t/p/w780${movieDetail.poster_path}`
        : undefined,
    }),
  );

  res.send(html);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
