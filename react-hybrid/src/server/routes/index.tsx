import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import { StaticRouter } from "react-router-dom";

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

router.get("/", async (req: Request, res: Response) => {
  const template = generateHTML();

  const response = await moviesApi.getPopular();
  const movies = response.data.results;

  const renderedApp = renderToString(
    <StaticRouter location={req.url}>
      <App initialMovies={movies} />
    </StaticRouter>
  );
  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
    window.__INITIAL_DATA__ = ${JSON.stringify({
      movies,
      movieDetail: null,
    })};
    </script>
  `
  );
  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp
  );

  res.send(renderedHTML);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const template = generateHTML();
  const movieId = Number(req.params.id);

  const [popularRes, detailRes] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);

  const movies = popularRes.data.results;
  const movieDetail = detailRes.data;

  const renderedApp = renderToString(
    <StaticRouter location={req.url}>
      <App initialMovies={movies} initialMovieDetail={movieDetail} />
    </StaticRouter>
  );

  const posterOriginal = `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`;

  const ogTags = `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${movieDetail.title} | 영화 리뷰</title>
  <meta property="og:title" content="${movieDetail.title}" />
  <meta property="og:description" content="${movieDetail.overview.slice(
    0,
    100
  )}..." />
  <meta property="og:image" content="${posterOriginal}" />
  <meta property="og:type" content="website" />

  
  `;

  const html = template
    .replace("<!--{OG_TAGS}-->", ogTags)
    .replace(
      "<!--{INIT_DATA_AREA}-->",
      `<script>window.__INITIAL_DATA__ = ${JSON.stringify({
        movies,
        movieDetail,
      })}</script>`
    )
    .replace("<!--{BODY_AREA}-->", renderedApp);

  res.send(html);
});

export default router;
