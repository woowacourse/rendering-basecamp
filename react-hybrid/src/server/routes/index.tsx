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
  const { data: popularMovies } = await moviesApi.getPopular();

  const template = generateHTML();
  const renderedApp = renderToString(<App movieData={popularMovies} />);

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify({ movies: popularMovies })}
    </script>
  `
  );

  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp
  );

  res.send(renderedHTML);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data: movieDetail } = await moviesApi.getDetail(id);
  const { data: popularMovies } = await moviesApi.getPopular();

  const template = generateHTML();

  const title = `${movieDetail.title} | 인기 영화 리뷰`;
  const description =
    movieDetail.overview?.slice(0, 100) || "영화 상세 정보를 확인해보세요!";
  const image = `https://image.tmdb.org/t/p/w780${movieDetail.poster_path}`;

  const ogTags = `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

  `;

  const renderedApp = renderToString(
    <App movieData={popularMovies} movieDetail={movieDetail} />
  );

  const withOG = template.replace("<!--{OG_TAGS}-->", ogTags);

  const renderedHTMLWithInitialData = withOG.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify({
        movies: popularMovies,
        movieDetail,
      })}
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
