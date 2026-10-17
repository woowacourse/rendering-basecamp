import { Router, Request, Response } from "express";
import axios from "axios";
import { renderToString } from "react-dom/server";

import App from "../../client/App";
import { moviesApi } from "../../client/api/movies";
import type { InitialData } from "../../client/types/InitialData.types";
import { escapeHtml } from "../views/escapeHtml";
import { renderLayout } from "../views/layout";
import { renderMovieOpenGraph } from "../views/openGraph";

const router = Router();

const renderErrorPage = (message: string) =>
  renderLayout({
    title: "영화 리뷰",
    appHtml: `<div id="wrap"><p>${escapeHtml(message)}</p><a href="/">홈으로</a></div>`,
  });

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { data } = await moviesApi.getPopular();
    const initialData: InitialData = { movies: data.results };

    res.send(
      renderLayout({
        title: "영화 리뷰",
        appHtml: renderToString(<App initialData={initialData} />),
        initialData,
      })
    );
  } catch (error) {
    console.error(error);
    res.status(502).send(renderErrorPage("영화 정보를 불러오는데 실패했습니다."));
  }
});

router.get("/detail/:id", async (req: Request<{ id: string }>, res: Response) => {
  const movieId = Number(req.params.id);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    res.status(404).send(renderErrorPage("존재하지 않는 영화입니다."));
    return;
  }

  try {
    const [popular, detail] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);
    const initialData: InitialData = {
      movies: popular.data.results,
      movieDetail: detail.data,
    };
    const pageUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    res.send(
      renderLayout({
        title: `${escapeHtml(detail.data.title)} - 영화 리뷰`,
        head: renderMovieOpenGraph(detail.data, pageUrl),
        appHtml: renderToString(<App initialData={initialData} />),
        initialData,
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

export default router;
