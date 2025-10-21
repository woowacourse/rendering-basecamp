import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { serverMoviesApi } from "../api/movies";
import { StaticRouter } from "react-router-dom/server";
import MovieHomePage from "../../client/pages/MovieHomePage";

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
    console.error("Error fetching movies:", error);
    res.status(500).send(`Internal Server Error: ${error}`);
  }
});

router.get("/movie/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [movieDetailResponse, popularMoviesResponse] = await Promise.all([
      serverMoviesApi.getDetail(Number(id)),
      serverMoviesApi.getPopular(),
    ]);

    const movieDetail = movieDetailResponse.data;
    const movies = popularMoviesResponse.data.results;

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

    const appHTML = renderToString(
      <StaticRouter location={req.url}>
        <App initialMovies={movies} />
      </StaticRouter>
    );

    const html = buildHTML({
      appHTML,
      initialData: { movies, movieDetail },
      ogTags,
    });

    res.send(html);
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/debug", (_: Request, res: Response) => {
  res.send("<h1>✅ 서버에서 HTML 응답은 됩니다.</h1>");
});

export default router;
