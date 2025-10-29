import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import MovieHomePage from '../../client/pages/MovieHomePage';
import { moviesApi } from '../../client/api/movies';
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
  const movies = await moviesApi.getPopular();
  const template = generateHTML();

  const renderedApp = renderToString(
    <App Component={MovieHomePage} initialData={movies.data.results} />
  );

  const renderedHTMLWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies.data.results)}
      }
      window.__INITIAL_ROUTE__ = '/'
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
  const movieId = req.params.id;
  const [movies, movie] = await Promise.all([
    moviesApi.getPopular(),
    await moviesApi.getDetail(Number(movieId)),
  ]);
  const template = generateHTML();

  const ogTags = `
    <meta property="og:title" content="${movie.data.title}" />
    <meta property="og:description" content="${movie.data.overview}" />
    <meta property="og:image" content="https://image.tmdb.org/t/p/original${movie.data.poster_path}" />
    <meta property="og:type" content="website" />
  `;

  const renderedApp = renderToString(
    <App
      Component={MovieDetailPage}
      initialData={{ movies: movies.data.results, movie: movie.data }}
    />
  );

  const renderedHTMLWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
      <script>
        window.__INITIAL_DATA__ = {
          movies: ${JSON.stringify(movies.data.results)},
          movie: ${JSON.stringify(movie.data)}
        }
        window.__INITIAL_ROUTE__ = '/detail/:id'
      </script>
    `
  );

  const renderedHTMLWithOgTag = renderedHTMLWithInitialData.replace(
    '<!--{OG_TAGS}-->',
    ogTags
  );

  const renderedHTML = renderedHTMLWithOgTag.replace(
    '<!--{BODY_AREA}-->',
    renderedApp
  );

  res.send(renderedHTML);
});

export default router;
