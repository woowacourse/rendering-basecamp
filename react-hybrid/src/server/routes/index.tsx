import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
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

async function renderPage(req: Request, res: Response) {
  const movieId = req.params.id;

  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular(),
    movieId ? moviesApi.getDetail(Number(movieId)) : Promise.resolve(null),
  ]);

  const initialData = {
    movies: popularResponse.data.results,
    movieDetail: detailResponse?.data ?? null,
  };

  const renderedApp = renderToString(<App {...initialData} />);

  const serializedData = JSON.stringify(initialData).replace(/</g, "\\u003c");

  const html = generateHTML()
    .replace("<!--{BODY_AREA}-->", () => renderedApp)
    .replace(
      "<!--{INIT_DATA_AREA}-->",
      () => `<script>window.__INITIAL_DATA__ = ${serializedData};</script>`,
    );

  res.send(html);
}

router.get("/", renderPage);
router.get("/detail/:id", renderPage);

export default router;
