import { Router, Request, Response } from 'express';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from '../../client/pages/MovieHomePage';
import MovieDetailPage from '../../client/pages/MovieDetailPage';
import { moviesApi } from '../api/movie';

const router = Router();

function generateHTML(body: string, initialData: any, url: string) {
  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>영화 리뷰</title>
      </head>
      <body>
        <div id="root">${body}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
          window.__INITIAL_URL__ = "${url}";
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

router.get('/', async (_: Request, res: Response) => {
  try {
    const moviesData = await moviesApi.getPopular(1);

    const renderedApp = renderToString(
      <OverlayProvider>
        <MovieHomePage />
      </OverlayProvider>
    );

    const html = generateHTML(renderedApp, { movies: moviesData.results, url: '/' }, '/');

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const movieId = req.params.id;

    const [moviesData, movieDetail] = await Promise.all([
      moviesApi.getPopular(1),
      moviesApi.getDetail(Number(movieId)),
    ]);

    const renderedApp = renderToString(
      <OverlayProvider>
        <MovieDetailPage />
      </OverlayProvider>
    );

    const html = generateHTML(
      renderedApp,
      {
        movies: moviesData.results,
        movieDetail: movieDetail,
        url: `/detail/${movieId}`,
      },
      `/detail/${movieId}`
    );

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

export default router;
