import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import { SeoHead } from "../utils/SeoHead";

const router = Router();

function generateHTML() {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
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
  const template = generateHTML();

  const movieList = await moviesApi.getPopular();

  const renderedApp = renderToString(
    <App initialMovies={movieList.data.results} />
  );

  const renderedHTMLWithSeo = template.replace(
    "<!--{OG_TAGS}-->",
    SeoHead({
      title: "인기 영화 추천",
      description: "지금 인기 있는 영화들을 만나보세요.",
      image: `https://image.tmdb.org/t/p/w1280${movieList.data.results[0].backdrop_path}`,
      url: "https://rendering-basecamp-production-8f18.up.railway.app/",
    })
  );

  const renderedHTMLWithInitialData = renderedHTMLWithSeo.replace(
    "<!--{INIT_DATA_AREA}-->",
    `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movieList.data.results)}
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
