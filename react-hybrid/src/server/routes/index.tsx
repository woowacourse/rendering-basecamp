import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';

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

router.get('/', async (req: Request, res: Response) => {
  try {
    const template = generateHTML();

    const moviesResponse = await moviesApi.getPopular(1);
    const movies = moviesResponse.data.results;

    const renderedApp = renderToString(
      <App url={req.url} initialMovies={movies} />
    );

    const ogTags = /*html*/ `
      <meta property="og:type" content="website" />
      <meta property="og:title" content="인기 영화 - 영화 리뷰" />
      <meta property="og:description" content="현재 인기있는 영화들을 확인하세요" />
      <meta property="og:image" content="https://image.tmdb.org/t/p/w500${
        movies[0].poster_path
      }" />
      <meta property="og:url" content="${req.protocol}://${req.get('host')}${
      req.originalUrl
    }" />
    `;

    const renderedHTMLWithInitialData = template.replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = {
          movies: ${JSON.stringify(movies)}
        }
      </script>
    `
    );
    const renderedHTMLWithOG = renderedHTMLWithInitialData.replace(
      '<!--{OG_TAGS}-->',
      ogTags
    );
    const renderedHTML = renderedHTMLWithOG.replace(
      '<!--{BODY_AREA}-->',
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/detail/:movieId', async (req: Request, res: Response) => {
  try {
    const template = generateHTML();
    const movieId = parseInt(req.params.movieId, 10);

    // 영화 목록과 상세 정보 동시 조회
    const [moviesResponse, movieDetailResponse] = await Promise.all([
      moviesApi.getPopular(1),
      moviesApi.getDetail(movieId),
    ]);
    const movies = moviesResponse.data.results;
    const movieDetail = movieDetailResponse.data;

    const renderedApp = renderToString(
      <App url={req.url} initialMovies={movies} />
    );

    // OG 태그 생성
    const ogTags = /*html*/ `
      <meta property="og:type" content="website" />
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${
        movieDetail.overview || '영화 상세 정보'
      }" />
      <meta property="og:image" content="https://image.tmdb.org/t/p/w500${
        movieDetail.poster_path
      }" />
      <meta property="og:url" content="${req.protocol}://${req.get('host')}${
      req.originalUrl
    }" />
    `;

    const renderedHTMLWithInitialData = template.replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = {
          movies: ${JSON.stringify(movies)},
          movieDetail: ${JSON.stringify(movieDetail)}
        }
      </script>
    `
    );
    const renderedHTMLWithOG = renderedHTMLWithInitialData.replace(
      '<!--{OG_TAGS}-->',
      ogTags
    );
    const renderedHTML = renderedHTMLWithOG.replace(
      '<!--{BODY_AREA}-->',
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
