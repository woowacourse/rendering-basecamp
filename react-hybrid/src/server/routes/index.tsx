import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

import App from "../../client/App";
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

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

router.get("/", async (req: Request, res: Response) => {
  const template = generateHTML();

  const popularData = await moviesApi.getPopular();
  const movies = popularData.data.results;

  const renderedApp = renderToString(
    <StaticRouter location={req.url}>
      <App movies={movies} />
    </StaticRouter>,
  );

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)}
      }
    </script>
  `,
  );
  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp,
  );

  res.send(renderedHTML);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);

  const template = generateHTML();

  const [popularData, detailData] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);

  const movies = popularData.data.results;
  const movie = detailData.data;

  const renderedApp = renderToString(
    <StaticRouter location={req.url}>
      <App movies={movies} movie={movie} />
    </StaticRouter>,
  );

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)},
        movie: ${JSON.stringify(movie)}
      }
    </script>
  `,
  );
  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp,
  );

  const renderedHTMLWithOGTags = renderedHTML.replace(
    "<!--{OG_TAGS}-->",
    /*html*/ `
    <title>${movie.title}</title>
    <meta name="description" content="${movie.overview}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${movie.title}" />
    <meta property="og:description" content="${movie.overview}" />
    ${movie.poster_path ? `<meta property="og:image" content="${`${TMDB_IMAGE_URL}/w500${movie.poster_path}`}" />` : ""}
  `,
  );

  res.send(renderedHTMLWithOGTags);
});

export default router;
