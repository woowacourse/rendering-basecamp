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

router.get("/", async (req: Request, res: Response) => {
  const template = generateHTML();
  const popularMovies = await moviesApi.getPopular();
  const movies = popularMovies.data.results || [];

  const renderedApp = renderToString(<App initialMovies={movies} />);

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const ogTags = /*html*/ `
    <meta property="og:title" content="영화 리뷰 - 인기 영화 모음" />
    <meta property="og:description" content="지금 가장 인기 있는 영화들을 확인해보세요." />
    <meta property="og:image" content="${baseUrl}/images/logo.png" />
    <meta property="og:url" content="${baseUrl}/" />
    <meta property="og:type" content="website" />
  `;

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)}
      }
    </script>
  `
  );
  const renderedHTML = renderedHTMLWithInitialData
    .replace("<!--{BODY_AREA}-->", renderedApp)
    .replace("<!--{OG_TAGS}-->", ogTags);

  res.send(renderedHTML);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const template = generateHTML();
  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(id)),
  ]);
  const movies = popularResponse.data?.results ?? [];
  const detail = detailResponse.data ?? null;

  const renderedApp = renderToString(
    <App initialMovies={movies} initialDetail={detail} />
  );
  const initialData = { movies, detail };
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const imagePath = detail?.backdrop_path || detail?.poster_path || "";
  const ogImage = imagePath
    ? `https://image.tmdb.org/t/p/w1280${imagePath}`
    : `${baseUrl}/images/logo.png`;

  const ogTags = /*html*/ `
    <meta property="og:title" content="${
      detail?.title || "영화 리뷰"
    } - 영화 리뷰" />
    <meta property="og:description" content="${
      detail?.overview || "영화 상세 정보를 확인해보세요."
    }" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${baseUrl}/detail/${id}" />
    <meta property="og:type" content="video.movie" />
  `;

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
      <script>
        window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}
      </script>
    `
  );
  const renderedHTML = renderedHTMLWithInitialData
    .replace("<!--{BODY_AREA}-->", renderedApp)
    .replace("<!--{OG_TAGS}-->", ogTags);
  res.send(renderedHTML);
});

export default router;
