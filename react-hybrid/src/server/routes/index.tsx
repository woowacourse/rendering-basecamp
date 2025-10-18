import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import { MovieItem } from "../../client/types/Movie.types";
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

router.get("/", async (req: Request, res: Response) => {
  const template = generateHTML();
  let moviesData = [] as MovieItem[];
  try {
    const res = await moviesApi.getPopular();
    if (res.data) {
      moviesData = res.data.results;
    }
  } catch (error) {
    console.log(error);
  }
  const renderedApp = renderToString(
    <StaticRouter location={req.url}>
      <App initialData={{ movies: moviesData }} />
    </StaticRouter>
  );

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(moviesData)}
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
