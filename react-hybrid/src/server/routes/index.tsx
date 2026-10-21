import { Router, Request, Response } from "express";

import { renderToStaticMarkup, renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { StaticRouter } from "react-router-dom";

import { moviesApi } from "../api/movies";
import type { MovieDetailResponse } from "../../client/types/MovieDetail.types";

const router = Router();

function generateHTML(movieDetail: MovieDetailResponse | null) {
  const metadata = movieDetail ? renderToStaticMarkup(
    <>
      <title>{movieDetail.title}</title>
      <meta name="description" content={movieDetail.overview || `${movieDetail.title} 상세 정보`} />
      <meta property="og:title" content={movieDetail.title} />
      <meta property="og:description" content={movieDetail.overview || `${movieDetail.title} 상세 정보`} />
      {movieDetail.poster_path && (
        <meta property="og:image" content={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`} />
      )}
      <meta property="og:type" content="website" />
    </>
  ) : "<title>영화 리뷰</title>";

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        ${metadata}
      </head>
      <body>
        <div id="root"><!--{BODY_AREA}--></div>
        <!--{INIT_DATA_AREA}-->
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

async function renderPage(req: Request, res: Response) {
  const movieId = req.params.id;

  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular(),
    movieId ? moviesApi.getDetail(Number(movieId)) : Promise.resolve(null),
  ]);

  const initialData = {
    movies: popularResponse.data.results,
    movieDetail: detailResponse?.data ?? null,
  };

  const renderedApp = renderToString(
    <StaticRouter location={req.originalUrl}>
      <App {...initialData} />
    </StaticRouter>
  );

  const serializedData = JSON.stringify(initialData).replace(/</g, "\\u003c");

  const html = generateHTML(initialData.movieDetail)
    .replace("<!--{BODY_AREA}-->", () => renderedApp)
    .replace(
      "<!--{INIT_DATA_AREA}-->",
      () => `<script>window.__INITIAL_DATA__ = ${serializedData};</script>`,
    );

  res.send(html);
}

router.get("/", renderPage);
router.get("/detail/:id", renderPage);

router.get("/api/movies", async (req: Request, res: Response) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  if (!Number.isSafeInteger(page) || page < 1 || page > 500) {
    res.status(400).json({ message: "페이지는 1~500 사이의 정수여야 합니다." });
    return;
  }
  const { data } = await moviesApi.getPopular(page);
  res.json(data);
});

router.get("/api/movies/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    res.status(400).json({ message: "유효하지 않은 영화 ID입니다." });
    return;
  }
  const { data } = await moviesApi.getDetail(id);
  res.json(data);
});

export default router;
