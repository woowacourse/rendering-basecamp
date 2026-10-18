import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { getPopularMovies } from "../tmdb";

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

/**
 * 데이터를 <script> 안에 넣을 때 "</script>" 같은 문자열이 태그를 닫지 않도록 "<"를 이스케이프한다.
 */
function serialize(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

router.get("/", async (_: Request, res: Response) => {
  try {
    const movies = await getPopularMovies();
    const template = generateHTML();

    const renderedApp = renderToString(<App movies={movies} />);

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${serialize(movies)}
      }
    </script>
  `
    );
    const renderedHTML = renderedHTMLWithInitialData.replace(
      "<!--{BODY_AREA}-->",
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error(error);
    res.status(500).send("영화 정보를 불러오는 중 문제가 발생했습니다.");
  }
});

export default router;
