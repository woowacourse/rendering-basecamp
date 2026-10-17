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

router.get("/", async (_: Request, res: Response) => {
  const response = await moviesApi.getPopular();
  const movies = response.data.results;

  const renderedApp = renderToString(<App movies={movies} />);

  const initialData = JSON.stringify({ movies }).replace(/</g, "\\u003c");

  const renderHtml = generateHTML()
    .replace("<!--{BODY_AREA}-->", () => renderedApp)
    .replace(
      "<!--{INIT_DATA_AREA}-->",
      () => `<script>window.__INITIAL_DATA__ = ${initialData};</script>`,
    );

  res.send(renderHtml);
});

export default router;
