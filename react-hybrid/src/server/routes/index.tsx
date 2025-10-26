import { Router, Request, Response } from "express";
import { renderToString } from "react-dom/server";
import React from "react";
import { moviesApi } from "../service/tmdbApi";
import MovieHomePage from "../../client/pages/MovieHomePage";
import { OverlayProvider } from "overlay-kit";
import MovieDetailPage from "../../client/pages/MovieDetailPage";

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
  const movieResponse = await moviesApi.getPopular(1);
  const movies = movieResponse.results;

  const template = generateHTML();

  const renderedApp = renderToString(
    <OverlayProvider>
      <MovieHomePage />
    </OverlayProvider>
  );

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
  const renderedHTML = renderedHTMLWithInitialData.replace(
    "<!--{BODY_AREA}-->",
    renderedApp
  );

  res.send(renderedHTML);
});

router.get("/detail/:movieId", async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;

    const [moviesData, detailData] = await Promise.all([
      moviesApi.getPopular(1),
      moviesApi.getDetail(Number(movieId)),
    ]);

    const movies = moviesData.results;

    const template = generateHTML();

    const renderedApp = renderToString(
      <OverlayProvider>
        <MovieDetailPage />
      </OverlayProvider>
    );

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)},
        detail: ${JSON.stringify(detailData)}
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
    console.error("영화 데이터 조회 실패:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

export default router;
