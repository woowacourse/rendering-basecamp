import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";

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

const movies = [
  {
    adult: true,
    backdrop_path: null,
    genre_ids: [1, 2],
    id: 1,
    original_language: "ko",
    original_title: "첫 번째 영화",
    overview: "첫 번째 설명임",
    popularity: 123,
    poster_path: null,
    release_date: "2020-10-10",
    title: "첫 번째 제목임",
    video: true,
    vote_average: 10,
    vote_count: 10,
  },
  {
    adult: true,
    backdrop_path: null,
    genre_ids: [1, 2],
    id: 2,
    original_language: "ko",
    original_title: "두 번째 영화",
    overview: "두 번째 설명임",
    popularity: 123,
    poster_path: null,
    release_date: "2020-10-10",
    title: "두 번째 제목임",
    video: true,
    vote_average: 10,
    vote_count: 10,
  },
];

router.get("/", (_: Request, res: Response) => {
  const template = generateHTML();

  const renderedApp = renderToString(<App movies={movies} />);

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

export default router;
