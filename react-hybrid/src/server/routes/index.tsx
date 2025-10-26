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
  const popularMoviesResponse = await moviesApi.getPopular();
  const movies = popularMoviesResponse.data.results;
  const initialData = {
    movies,
    detail: undefined,
  };

  const renderedApp = renderToString(
    <App initialData={initialData} page="home" />
  );

  const renderedHTMLWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify({ page: 'home', initialData })}
      
    </script>
  `
  );
  const renderedHTML = renderedHTMLWithInitialData.replace(
    '<!--{BODY_AREA}-->',
    renderedApp
  );

  res.send(renderedHTML);
});

router.get('/detail/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(id)),
  ]);
  const template = generateHTML();
  const initialData = {
    movies: popularResponse.data.results,
    detail: detailResponse.data,
  };

  const renderedApp = renderToString(
    <App initialData={initialData} page="detail" />
  );

  const renderedHTMLWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify({
        page: 'detail',
        initialData,
      })}
      
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
