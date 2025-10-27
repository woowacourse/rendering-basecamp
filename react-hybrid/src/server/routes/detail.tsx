import { Router, Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { moviesApi } from "../../client/api/movies";
import React from "react";
import App from "../../client/App";

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

router.get("/:movieId", async (req: Request, res: Response) => {
  const { movieId } = req.params;

  const moviesData = await moviesApi.getPopular();
  const detailData = await moviesApi.getDetail(Number(movieId));

  const movies = moviesData.data.results;
  const template = generateHTML();

  const renderedApp = renderToString(
    <App
      movies={movies}
      movieDetail={detailData.data}
      movieId={Number(movieId)}
      initialPath={`/detail/${movieId}`}
    />
  );

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)},
        detail: ${JSON.stringify(detailData.data)}
      }
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
