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
  const movies = await moviesApi.getPopular();
  const template = generateHTML();

  const renderedApp = renderToString(
    <App
      initialMovies={movies.data.results}
      path="/"
    />,
  );

  const renderedHTMLWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
         movies: ${JSON.stringify(movies.data.results)},
         path: "/"
      }
    </script>
  `,
  );
  const renderedHTML = renderedHTMLWithInitialData.replace('<!--{BODY_AREA}-->', renderedApp);

  res.send(renderedHTML);
});

router.get('/detail/:id', async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);

  const [movies, movieDetail] = await Promise.all([moviesApi.getPopular(), moviesApi.getDetail(movieId)]);
  const template = generateHTML();

  const renderedApp = renderToString(
    <App
      initialMovies={movies.data.results}
      initialMovieDetail={movieDetail.data}
      path={`/detail/${movieId}`}
    />,
  );

  const renderedHTMLWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
         movies: ${JSON.stringify(movies.data.results)},
         movieDetail: ${JSON.stringify(movieDetail.data)},
         path: "/detail/${movieId}"
      }
    </script>
  `,
  );
  const renderedHTML = renderedHTMLWithInitialData.replace('<!--{BODY_AREA}-->', renderedApp);

  res.send(renderedHTML);
});

export default router;
