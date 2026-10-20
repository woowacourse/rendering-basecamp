import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import type { InitialData } from "../../client/types/InitialData";

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

function sendPage(res: Response, initialData: InitialData) {
  const template = generateHTML();
  const renderedApp = renderToString(<App initialData={initialData} />);
  const serializedData = JSON.stringify(initialData).replace(/</g, "\\u003c");

  const renderedHTML = template
    .replace("<!--{BODY_AREA}-->", renderedApp)
    .replace(
      "<!--{INIT_DATA_AREA}-->",
      `<script>window.__INITIAL_DATA__ = ${serializedData};</script>`
    );

  res.send(renderedHTML);
}

router.get("/", async (_: Request, res: Response) => {
  try {
    const { data } = await moviesApi.getPopular();
    sendPage(res, { page: 'home', movies: data.results });
  } catch (error) {
    console.error("Failed to render movies", error);
    res.status(502).send("영화 정보를 불러오는데 실패했습니다.");
  }
});

router.get('/detail/:movieId', async (req: Request, res: Response) => {
  const movieId = Number(req.params.movieId);
  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    res.status(400).send('올바르지 않은 영화 ID입니다.');
    return;
  }

  try {
    const [popular, detail] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);
    sendPage(res, {
      page: 'detail',
      movies: popular.data.results,
      movieDetail: detail.data,
    });
  } catch (error) {
    console.error('Failed to render movie detail', error);
    res.status(502).send('영화 정보를 불러오는데 실패했습니다.');
  }
});

export default router;
