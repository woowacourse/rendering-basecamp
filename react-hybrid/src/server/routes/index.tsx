import { Router, Request, Response } from "express";

import { renderToString } from "react-dom/server";
import React from "react";
import { moviesApi } from '../../client/api/movies';
import MovieHomePage from '../../client/pages/MovieHomePage';
import { MovieDetailModal } from '../../client/components/MovieDetailModal';
import MovieDetailPage from '../../client/pages/MovieDetailPage';

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
  try {
    // 서버에서 영화 데이터 패칭
    const movieResponse = await moviesApi.getPopular();
    const movies = movieResponse.data.results;

    const template = generateHTML();

    // MovieHomePageSSR 컴포넌트를 SSR로 렌더링
    const renderedApp = renderToString(
      <MovieHomePage movies={movies} />
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
  } catch (error) {
    console.error("Error fetching movies:", error);
    const template = generateHTML();
    const errorHTML = template
      .replace(
        "<!--{BODY_AREA}-->",
        "<div>영화 정보를 불러오는데 실패했습니다.</div>"
      )
      .replace(
        "<!--{INIT_DATA_AREA}-->",
        /*html*/ `
        <script>
          window.__INITIAL_DATA__ = {
            movies: []
          }
        </script>
      `
      );
    res.send(errorHTML);
  }
});

router.get("/detail/:movieId", async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;

    // 서버에서 영화 목록과 상세 정보 패칭
    const [moviesResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId))
    ]);

    const movies = moviesResponse.data.results;
    const movieDetail = detailResponse.data;

    const template = generateHTML();

    // 홈페이지와 상세 정보 함께 렌더링
    const renderedApp = renderToString(
      <MovieDetailPage movies={movies} detail={movieDetail} />
    );

    const renderedHTMLWithInitialData = template.replace(
      "<!--{INIT_DATA_AREA}-->",
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = {
          movies: ${JSON.stringify(movies)},
          detail: ${JSON.stringify(movieDetail)}
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
    console.error("Error fetching movie detail:", error);
    const template = generateHTML();
    const errorHTML = template
      .replace(
        "<!--{BODY_AREA}-->",
        "<div>영화 정보를 불러오는데 실패했습니다.</div>"
      )
      .replace(
        "<!--{INIT_DATA_AREA}-->",
        /*html*/ `
        <script>
          window.__INITIAL_DATA__ = {
            movies: [],
            movieDetail: null
          }
        </script>
      `
      );
    res.send(errorHTML);
  }
});

export default router;
