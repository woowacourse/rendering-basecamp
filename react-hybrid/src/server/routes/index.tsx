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

    const renderedApp = renderToString(<App url={req.url} />);

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
    console.error('Error fetching movies:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/detail/:movieId', async (req: Request, res: Response) => {
  try {
    const template = generateHTML();
    const movieId = parseInt(req.params.movieId, 10);

    const movieDetailResponse = await moviesApi.getDetail(movieId);
    const movieDetail = movieDetailResponse.data;

    const renderedApp = renderToString(<App url={req.url} />);

    const renderedHTMLWithInitialData = template.replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = {
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
    console.error('Error fetching movie detail:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
