import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';
import { MovieItem } from '../../client/types/Movie.types';
import { MovieDetailResponse } from '../../client/types/MovieDetail.types';

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

  const imageUrl = popularMovieList[0]?.poster_path
    ? `https://image.tmdb.org/t/p/w500${popularMovieList[0]?.poster_path}`
    : '/images/no_image.png';
  const ogTags = `
  <meta property="og:title" content="MovieList" />
  <meta property="og:description" content="현재 인기 영화 목록을 확인해볼 수 있습니다!" />
  <meta property="og:image" content="${imageUrl}" />
`;
  const withOG = template.replace('<!--{OG_TAGS}-->', ogTags);

  const renderedHTMLWithInitialData = withOG.replace(
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

router.get('/details/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const popularMovieList: MovieItem[] | null = await moviesApi
    .getPopular()
    .then((res) => res.data.results ?? null)
    .catch((err) => {
      console.log(err);
      return null;
    });
  const movieDetail: MovieDetailResponse | null = await moviesApi
    .getDetail(Number(id))
    .then((res) => res.data ?? null)
    .catch((err) => {
      console.log(err);
      return null;
    });

  const renderedApp = renderToString(
    <App
      initialPopularMovieList={popularMovieList}
      initialMovieDetail={movieDetail}
    />
  );

  const template = generateHTML();

  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
    : '/images/no_image.png';
  const ogTags = `
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${
        movieDetail.overview || '상세 내용을 확인하세요.'
      }" />
      <meta property="og:image" content="${imageUrl}" />
    `;
  const withOG = template.replace('<!--{OG_TAGS}-->', ogTags);

  const renderedHTMLWithInitialData = withOG.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        popularMovieList: ${JSON.stringify(popularMovieList)},
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
});

export default router;
