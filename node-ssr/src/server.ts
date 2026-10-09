import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import express, { Request, Response } from "express";
import path from "path";
import { moviesApi } from "./service/tmdbApi";
import { escapeHtml } from "./views/escapeHtml";
import { renderHome } from "./views/home";
import { renderLayout } from "./views/layout";
import { renderModal } from "./views/modal";
import { renderMovieOpenGraph } from "./views/openGraph";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.set("trust proxy", true);
app.use(express.json());

const renderErrorPage = (message: string) =>
  renderLayout({
    title: "영화 리뷰",
    body: `<div id="wrap"><p>${message}</p><a href="/">홈으로</a></div>`,
  });

app.get("/", async (_req: Request, res: Response) => {
  try {
    const { results } = await moviesApi.getPopular();

    res.send(renderLayout({ title: "영화 리뷰", body: renderHome(results) }));
  } catch (error) {
    console.error(error);
    res.status(502).send(renderErrorPage("영화 정보를 불러오는데 실패했습니다."));
  }
});

app.get("/detail/:id", async (req: Request<{ id: string }>, res: Response) => {
  const movieId = Number(req.params.id);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    res.status(404).send(renderErrorPage("존재하지 않는 영화입니다."));
    return;
  }

  try {
    const [{ results }, movie] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);
    const pageUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    res.send(
      renderLayout({
        title: `${escapeHtml(movie.title)} - 영화 리뷰`,
        head: renderMovieOpenGraph(movie, pageUrl),
        body: renderHome(results) + renderModal(movie),
      })
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      res.status(404).send(renderErrorPage("존재하지 않는 영화입니다."));
      return;
    }

    console.error(error);
    res.status(502).send(renderErrorPage("영화 정보를 불러오는데 실패했습니다."));
  }
});

app.use(express.static(path.join(__dirname, "../public"), { index: false }));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
