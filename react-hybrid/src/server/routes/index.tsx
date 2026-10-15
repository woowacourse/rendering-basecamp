import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import type { InitialData } from "../../client/types/global";
import type { MovieDetailResponse } from "../../client/types/MovieDetail.types";

const router = Router();

const DEFAULT_TITLE = "영화 리뷰";
const DEFAULT_DESCRIPTION = "지금 인기 있는 영화를 확인하고 평점을 남겨보세요.";

function escapeHTML(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function serializeData(data: InitialData) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function generateOGTags(url: string, movieDetail?: MovieDetailResponse | null) {
  const title = movieDetail ? movieDetail.title : DEFAULT_TITLE;
  const description = movieDetail?.overview || DEFAULT_DESCRIPTION;
  const image = movieDetail?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
    : "/images/logo.png";

  return /*html*/ `
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHTML(url)}" />
    <meta property="og:title" content="${escapeHTML(title)}" />
    <meta property="og:description" content="${escapeHTML(description)}" />
    <meta property="og:image" content="${escapeHTML(image)}" />
    <meta name="description" content="${escapeHTML(description)}" />
  `;
}

function generateHTML({
  url,
  initialData,
}: {
  url: string;
  initialData: InitialData;
}) {
  const { movieDetail } = initialData;
  const title = movieDetail ? `${movieDetail.title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const renderedApp = renderToString(<App {...initialData} />);

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>${escapeHTML(title)}</title>
        ${generateOGTags(url, movieDetail)}
      </head>
      <body>
        <div id="root">${renderedApp}</div>
        <script>
          window.__INITIAL_DATA__ = ${serializeData(initialData)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

function getRequestURL(req: Request) {
  return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
}

async function fetchPopularMovies() {
  try {
    const response = await moviesApi.getPopular();
    return response.data.results;
  } catch {
    return [];
  }
}

router.get("/", async (req: Request, res: Response) => {
  const movies = await fetchPopularMovies();

  res.send(generateHTML({ url: getRequestURL(req), initialData: { movies } }));
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const [movies, movieDetail] = await Promise.all([
    fetchPopularMovies(),
    moviesApi
      .getDetail(Number(req.params.id))
      .then((response) => response.data)
      .catch(() => null),
  ]);

  res.send(
    generateHTML({
      url: getRequestURL(req),
      initialData: { movies, movieDetail },
    })
  );
});

export default router;
