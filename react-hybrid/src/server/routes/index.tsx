import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';
import MovieHomePage from '../../client/pages/MovieHomePage';
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

router.get('/', async (_: Request, res: Response) => {
  try {
    const response = await moviesApi.getPopular();
    const movies = response.data.results;

    const template = generateHTML();

    const renderedApp = renderToString(<MovieHomePage movies={movies} />);

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
    const renderedHTML = renderedHTMLWithInitialData.replace(
      '<!--{BODY_AREA}-->',
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    res.status(500).send('영화 정보를 불러오는데 실패했습니다.');
  }
});

// 영화 상세 페이지 라우트
router.get('/detail/:movieId', async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.movieId);

    if (isNaN(movieId)) {
      return res.status(400).send('Invalid movie ID');
    }

    // 인기 영화 목록과 선택된 영화 상세 정보를 가져옴
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    const movies = popularResponse.data.results;
    const movieDetail = detailResponse.data;

    const template = generateHTML();

    const renderedApp = renderToString(
      <MovieDetailPage
        movies={movies}
        movieId={movieId}
        movieDetail={movieDetail}
      />
    );

    const renderedHTMLWithInitialData = template.replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = {
          movies: ${JSON.stringify(movies)},
          movieId: ${movieId},
          movieDetail: ${JSON.stringify(movieDetail)}
        }
      </script>
    `
    );
    const renderedHTML = renderedHTMLWithInitialData.replace(
      '<!--{BODY_AREA}-->',
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error('Failed to fetch movie detail:', error);
    res.status(500).send('영화 상세 정보를 불러오는데 실패했습니다.');
  }
});

export default router;
