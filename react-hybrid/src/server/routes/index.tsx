import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';
import { MovieItem } from '../../client/types/Movie.types';

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
  const popularMovieList: MovieItem[] | null = await moviesApi
    .getPopular()
    .then((res) => {
      return res.data.results ?? null;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  const renderedApp = renderToString(
    <App initialPopularMovieList={popularMovieList} />
  );

  const template = generateHTML();

  const renderedHTMLWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        popularMovieList: ${JSON.stringify(popularMovieList)},
      }
    </script>
  `
  );

  const renderedHTML = renderedHTMLWithInitialData.replace(
    '<!--{BODY_AREA}-->',
    renderedApp
  );

  res.send(renderedHTML);
});

export default router;
