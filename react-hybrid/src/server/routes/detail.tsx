import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import { OverlayProvider } from "overlay-kit";
import MovieDetailPage from "../../client/pages/MovieDetailPage";
import React from "react";
import { moviesApi } from "../../client/api/movies";

const router = Router();

function generateHTML() {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>영화 리뷰</title>
        <!--{OG_TAGS}-->
      </head>
      <body>
        <div id="root"><!--{BODY_AREA}--></div>
        <!--{INIT_DATA_AREA}-->
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

router.get("/:id", async (req: Request, res: Response) => {
  const template = generateHTML();
  const movieId = Number(req.params.id);

  const moviesResponse = await moviesApi.getPopular();
  const detailMovieResponse = await moviesApi.getDetail(movieId);

  const movies = moviesResponse.data.results;
  const detailMovie = detailMovieResponse.data;

  const renderedApp = renderToString(
    <OverlayProvider>
      <MovieDetailPage movies={movies} detailMovie={detailMovie} />
    </OverlayProvider>
  );

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify({
        movies,
        movieId,
        detailMovie,
      })}
    </script>
  `
  );
  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp
  );

  res.send(renderedHTML);
});

export default router;
