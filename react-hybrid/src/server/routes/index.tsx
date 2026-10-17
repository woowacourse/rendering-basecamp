import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import App from "../../client/App";
import React from "react";
import { moviesApi } from "../../client/api/movies";
import type { MovieItem } from "../../client/types/Movie.types";
import {
  InitialDataContext,
  type InitialData,
} from "../../client/contexts/InitialDataContext";

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

async function fetchPopularMovies(): Promise<MovieItem[]> {
  try {
    const { data } = await moviesApi.getPopular();
    return data.results;
  } catch (error) {
    console.error("인기 영화 목록을 불러오지 못했습니다.", error);
    return [];
  }
}

async function fetchMovieDetail(movieId: number) {
  try {
    const { data } = await moviesApi.getDetail(movieId);
    return data;
  } catch (error) {
    console.error("영화 상세 정보를 불러오지 못했습니다.", error);
    return undefined;
  }
}

function renderPage(initialData: InitialData) {
  const template = generateHTML();

  const renderedApp = renderToString(
    <InitialDataContext.Provider value={initialData}>
      <App />
    </InitialDataContext.Provider>
  );

  // 데이터에 "</script>"가 섞여 있어도 스크립트 태그가 끊기지 않게 < 를 이스케이프
  const serializedData = JSON.stringify(initialData).replace(/</g, "\\u003c");

  const renderedHTMLWithInitialData = template.replace(
    "<!--{INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${serializedData}
    </script>
  `
  );
  return renderedHTMLWithInitialData.replace("<!--{BODY_AREA}-->", renderedApp);
}

router.get("/", async (_: Request, res: Response) => {
  const movies = await fetchPopularMovies();
  res.send(renderPage({ movies }));
});

router.get("/detail/:movieId", async (req: Request, res: Response) => {
  const [movies, movieDetail] = await Promise.all([
    fetchPopularMovies(),
    fetchMovieDetail(Number(req.params.movieId)),
  ]);
  res.send(renderPage({ movies, movieDetail }));
});

export default router;
