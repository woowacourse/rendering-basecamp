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

router.get('/', async (_: Request, res: Response) => {
  const template = generateHTML();
  try {
    const popularMovies = await moviesApi.getPopular();
    const movies = popularMovies.data?.results ?? [];

    const renderedApp = renderToString(<App initialMovies={movies} />);

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
    console.error(error);
    res.status(500).send('영화 데이터를 불러오는 중 오류가 발생했습니다.');
  }
});

export default router;
