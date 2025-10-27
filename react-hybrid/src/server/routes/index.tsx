import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';
import { generateOGTags } from '../utils/generateOGTags';
import { getRequestUrl } from '../utils/getRequestUrl';

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
  const movies = await moviesApi.getPopular();
  const template = generateHTML();

  const renderedApp = renderToString(
    <App
      initialMovies={movies.data.results}
      path="/"
    />,
  );

  const currentUrl = getRequestUrl(req);

  const ogTags = generateOGTags({
    title: '영화 리뷰 - 지금 인기 있는 영화',
    description: '최신 인기 영화를 확인하고 리뷰를 남겨보세요',
    url: currentUrl,
    type: 'website',
    siteName: '영화 리뷰',
  });

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
  const renderedHTMLWithOG = renderedHTMLWithInitialData.replace('<!--{OG_TAGS}-->', ogTags);
  const renderedHTML = renderedHTMLWithOG.replace('<!--{BODY_AREA}-->', renderedApp);

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

  const posterUrl = movieDetail.data.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetail.data.poster_path}`
    : undefined;

  const currentUrl = getRequestUrl(req);

  const ogTags = generateOGTags({
    title: movieDetail.data.title,
    description: movieDetail.data.overview || movieDetail.data.title,
    image: posterUrl,
    url: currentUrl,
    type: 'video.movie',
    siteName: '영화 상세 정보',
  });

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
  const renderedHTMLWithOG = renderedHTMLWithInitialData.replace('<!--{OG_TAGS}-->', ogTags);
  const renderedHTML = renderedHTMLWithOG.replace('<!--{BODY_AREA}-->', renderedApp);

  res.send(renderedHTML);
});

export default router;
