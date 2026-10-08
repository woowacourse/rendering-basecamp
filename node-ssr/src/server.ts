import dotenv from "dotenv";
dotenv.config();

import express, { ErrorRequestHandler, Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { renderDetailPage } from "./views/detailPage";
import { renderErrorPage } from "./views/errorPage";
import { renderHomePage } from "./views/homePage";
import { renderNotFoundPage } from "./views/notFoundPage";

const app = express();
const PORT = process.env.PORT ?? 8080;

app.set("trust proxy", true);
app.use(express.json());

const getPopularMoviesOrEmpty = async () => {
  try {
    const { results } = await moviesApi.getPopular();
    return results;
  } catch (error) {
    console.error("인기 영화 목록을 불러오지 못해 빈 목록으로 그립니다.", error);
    return [];
  }
};

app.get("/", async (_req: Request, res: Response) => {
  const { results: movies } = await moviesApi.getPopular();
  res.send(renderHomePage(movies));
});

app.get("/detail/:id", async (req: Request<{ id: string }>, res: Response) => {
  const movieId = Number(req.params.id);

  if (!Number.isInteger(movieId) || movieId < 1) {
    res.status(404).send(renderNotFoundPage());
    return;
  }

  const [movie, movies] = await Promise.all([
    moviesApi.getDetail(movieId),
    getPopularMoviesOrEmpty(),
  ]);

  if (movie === null) {
    res.status(404).send(renderNotFoundPage());
    return;
  }

  const origin = `${req.protocol}://${req.get("host")}`;
  res.send(renderDetailPage({ movies, movie, origin }));
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.use((_req: Request, res: Response) => {
  res.status(404).send(renderNotFoundPage());
});

const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error("요청을 처리하지 못했습니다.", error);
  res.status(500).send(renderErrorPage());
};

app.use(handleError);

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
