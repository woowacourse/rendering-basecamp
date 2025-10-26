import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import { OverlayProvider } from "overlay-kit";
import MovieDetailPage from "../../client/pages/MovieDetailPage";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import { MovieDetailResponse } from "../../client/types/MovieDetail.types";

const router = Router();

function generateHTML({ detailMovie }: { detailMovie: MovieDetailResponse }) {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>${detailMovie.title} - 영화 리뷰</title>
        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content="${detailMovie.title}" />
        <meta property="og:description" content="${
          detailMovie.overview || "줄거리 정보가 없습니다."
        }" />
        <meta property="og:image" content="${
          detailMovie.poster_path
            ? `https://image.tmdb.org/t/p/original${detailMovie.poster_path}`
            : ""
        }" />
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

  const template = generateHTML({ detailMovie });

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
