import { Router, Request, Response } from "express";
import { isAxiosError } from "axios";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { tmdbApi } from "../tmdbApi";
import { escapeHtml, serializeForScript } from "../utils/html";
import type { InitialData } from "../../client/types/InitialData.types";

const router = Router();

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

interface PageOptions {
  title: string;
  description: string;
  ogTitle?: string;
  ogImage?: string;
  initialData: InitialData;
}

/**
 * App을 HTML로 렌더링하고, 브라우저가 같은 데이터로 hydration 할 수 있게
 * 렌더링에 쓴 데이터를 window.__INITIAL_DATA__ 로 함께 내려준다.
 */
function renderPage({
  title,
  description,
  ogTitle = title,
  ogImage,
  initialData,
}: PageOptions) {
  const renderedApp = renderToString(<App initialData={initialData} />);

  return /*html*/ `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/styles/index.css" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}" />` : ""}
  </head>
  <body>
    <div id="root">${renderedApp}</div>
    <script>
      window.__INITIAL_DATA__ = ${serializeForScript(initialData)};
    </script>
    <script src="/static/bundle.js"></script>
  </body>
</html>`;
}

/**
 * 에러 안내 페이지. hydration 할 화면이 없으므로 bundle.js를 넣지 않는다.
 */
function renderMessagePage(message: string) {
  return /*html*/ `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>영화 리뷰</title>
  </head>
  <body>
    <p>${escapeHtml(message)}</p>
  </body>
</html>`;
}

const isNotFoundError = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 404;

const parseMovieId = (value: string) => {
  const movieId = Number(value);
  return Number.isInteger(movieId) && movieId > 0 ? movieId : null;
};

router.get("/", async (_: Request, res: Response) => {
  try {
    const { results: movies } = await tmdbApi.getPopular();

    res.send(
      renderPage({
        title: "영화 리뷰",
        description: "지금 인기 있는 영화를 확인하고 별점을 남겨보세요.",
        initialData: { movies, movieDetail: null },
      })
    );
  } catch {
    res
      .status(500)
      .send(renderMessagePage("영화 정보를 불러오는데 실패했습니다."));
  }
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const movieId = parseMovieId(req.params.id);

  if (movieId === null) {
    res.status(404).send(renderMessagePage("존재하지 않는 영화입니다."));
    return;
  }

  try {
    const [{ results: movies }, movieDetail] = await Promise.all([
      tmdbApi.getPopular(),
      tmdbApi.getDetail(movieId),
    ]);

    res.send(
      renderPage({
        title: `${movieDetail.title} - 영화 리뷰`,
        description:
          movieDetail.overview || `${movieDetail.title}의 정보를 확인해 보세요.`,
        ogTitle: movieDetail.title,
        ogImage: movieDetail.poster_path
          ? `${TMDB_IMAGE_URL}/w500${movieDetail.poster_path}`
          : undefined,
        initialData: { movies, movieDetail },
      })
    );
  } catch (error) {
    if (isNotFoundError(error)) {
      res.status(404).send(renderMessagePage("존재하지 않는 영화입니다."));
      return;
    }

    res
      .status(500)
      .send(renderMessagePage("영화 정보를 불러오는데 실패했습니다."));
  }
});

/**
 * 브라우저에서 영화를 클릭했을 때 상세 정보를 주는 API.
 * 브라우저가 TMDB를 직접 부르지 않게 해서 토큰을 서버에만 둔다.
 */
router.get("/api/movies/:id", async (req: Request, res: Response) => {
  const movieId = parseMovieId(req.params.id);

  if (movieId === null) {
    res.status(404).json({ message: "존재하지 않는 영화입니다." });
    return;
  }

  try {
    res.json(await tmdbApi.getDetail(movieId));
  } catch (error) {
    const status = isNotFoundError(error) ? 404 : 500;
    res.status(status).json({ message: "영화 정보를 불러오지 못했습니다." });
  }
});

export default router;
