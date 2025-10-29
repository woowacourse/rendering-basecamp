import type { Request, Response } from "express";
import { Router } from "express";

import { renderToString } from "react-dom/server";
import React from "react";
import { getMovieDetail, getPopularMovies } from "../api/movies";
import App from "../../client/App";
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

const handleRequest = (req: Request) => {
  return renderToString(
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>,
  );
};

router.get("/", async (req: Request, res: Response) => {
  const template = generateHTML();

  const ogTags = `
    <meta property="og:title" content="영화 리뷰 사이트" />
    <meta property="og:description" content="영화 리뷰도 할 수 있고, 영화 정보도 얻을 수 있는 영화 리뷰 사이트" />
    <meta property="og:type" content="website" />
  `;
  const withOG = template.replace("<!--{OG_TAGS}-->", ogTags);

  const initialData = (await getPopularMovies()).results;

  const renderedHTMLWithInitialData = withOG.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(initialData)}
      }
    </script>
  `,
  );

  const renderedApp = handleRequest(req);
  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp,
  );

  res.send(renderedHTML);
});

router.get("/detail/:movieId", async (req: Request, res: Response) => {
  const template = generateHTML();

  const initialData = await getMovieDetail(Number(req.params.movieId));

  const ogTags = `
  <meta property="og:title" content="${initialData.title}" />
  <meta property="og:description" content="${initialData.overview}" />
  <meta property="og:image" content="https://image.tmdb.org/t/p/w500${initialData.poster_path}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${req.url}" />
`;
  const withOG = template.replace("<!--{OG_TAGS}-->", ogTags);

  const renderedHTMLWithInitialData = withOG.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movieDetail: ${JSON.stringify(initialData)}
      }
    </script>
  `,
  );

  const renderedApp = handleRequest(req);
  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp,
  );

  res.send(renderedHTML);
});

export default router;
