import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';
import type { MovieItem } from '../../client/types/Movie.types';
import type { MovieDetailResponse } from '../../client/types/MovieDetail.types';

const router = Router();

interface InitialData {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
}

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

function renderPage(initialData: InitialData, location: string) {
  const template = generateHTML();
  const renderedApp = renderToString(
    <StaticRouter location={location}>
      <App movies={initialData.movies} movieDetail={initialData.movieDetail} />
    </StaticRouter>,
  );

  return template
    .replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}
        </script>
      `,
    )
    .replace('<!--{BODY_AREA}-->', renderedApp);
}

router.get('/', async (_: Request, res: Response) => {
  try {
    const response = await moviesApi.getPopular();
    const movies = response.data.results;

    res.send(renderPage({ movies }, '/'));
  } catch (error) {
    console.error(error);
    res.status(500).send('영화 정보를 불러오지 못했습니다.');
  }
});

router.get('/detail/:movieId', async (req: Request, res: Response) => {
  const movieId = Number(req.params.movieId);

  if (!Number.isInteger(movieId) || movieId < 1) {
    res.status(400).send('잘못된 영화 ID입니다.');
    return;
  }

  try {
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    res.send(
      renderPage(
        {
          movies: popularResponse.data.results,
          movieDetail: detailResponse.data,
        },
        req.path,
      ),
    );
  } catch (error) {
    console.error(error);
    res.status(500).send('영화 정보를 불러오지 못했습니다.');
  }
});

export default router;
