import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { serverMoviesApi } from "../api/movies";
import { StaticRouter } from "react-router-dom/server";

const router = Router();

function buildHTML({
  appHTML,
  initialData,
  ogTags = "",
}: {
  appHTML: string;
  initialData: object;
  ogTags?: string;
}) {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>영화 리뷰</title>
        ${ogTags}
      </head>
      <body>
        <div id="root">${appHTML}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const popularMoviesResponse = await serverMoviesApi.getPopular();
    const movies = popularMoviesResponse.data;

    const appHTML = renderToString(
      <StaticRouter location={req.url}>
        <App initialMovies={movies.results} />
      </StaticRouter>
    );

    const html = buildHTML({
      appHTML,
      initialData: { movies: movies.results },
    });

    res.send(html);
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message || error}`);
  }
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [movieDetailResponse, popularMoviesResponse] = await Promise.all([
      serverMoviesApi.getDetail(Number(id)),
      serverMoviesApi.getPopular(),
    ]);

    const movieDetail = movieDetailResponse.data;
    const movies = popularMoviesResponse.data;

    const imageUrl = movieDetail.poster_path
      ? `https://image.tmdb.org/t/p/w550${movieDetail.poster_path}`
      : "";

    const ogTags = `
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${
        movieDetail.overview || "영화 상세 정보"
      }" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:type" content="video.movie" />
      <meta property="og:url" content="${req.protocol}://${req.get("host")}${
      req.originalUrl
    }" />
    `;

    const initialMoviesData = movies.results;

    const appHTML = renderToString(
      <StaticRouter location={`/detail/${id}`}>
        <App initialMovies={initialMoviesData} movieDetail={movieDetail} />
      </StaticRouter>
    );

    const html = buildHTML({
      appHTML,
      initialData: { movies: movies.results, movieDetail },
      ogTags,
    });

    res.send(html);
  } catch (error) {
    res
      .status(500)
      .send(
        `Internal Server Error ${req.params.id}: ${error.message || error}`
      );
  }
});

export default router;
