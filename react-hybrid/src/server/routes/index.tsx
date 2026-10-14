import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import { moviesApi } from '../../client/api/movies';
import type { MovieItem } from '../../client/types/Movie.types';
import React from 'react';

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
  let movies: MovieItem[] | null = null;

  try {
    const response = await moviesApi.getPopular();
    movies = response.data.results;
  } catch (error) {
    console.error('서버에서 인기 영화 정보를 불러오지 못했습니다:', error);
  }

  const initialData: InitialData = {
    page: 'home',
    movies,
  };
  const renderedApp = renderToString(<App initialData={initialData} />);

  const featuredImagePath = movies?.[0]?.backdrop_path;
  const homeOGTags = /*html*/ `
    <meta property="og:title" content="영화 리뷰" />
    <meta property="og:description" content="인기 영화를 둘러보고, 영화 정보를 확인해보세요." />
    ${featuredImagePath ? `<meta property="og:image" content="https://image.tmdb.org/t/p/original${featuredImagePath}" />` : ''}
  `;
  const templateWithOGTags = template.replace('<!--{OG_TAGS}-->', homeOGTags);
  const renderedHTMLWithInitialData = templateWithOGTags.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
    </script>
  `,
  );
  const renderedHTML = renderedHTMLWithInitialData.replace(
    '<!--{BODY_AREA}-->',
    renderedApp,
  );

  res.send(renderedHTML);
});

router.get('/detail/:id', async (req: Request, res: Response) => {
  const template = generateHTML();
  const movieId = Number(req.params.id);

  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular().catch(error => {
      console.error('서버에서 인기 영화 정보를 불러오지 못했습니다:', error);
      return null;
    }),
    moviesApi.getDetail(movieId).catch(error => {
      console.error('서버에서 영화 상세 정보를 불러오지 못했습니다:', error);
      return null;
    }),
  ]);

  const initialData: InitialData = {
    page: 'detail',
    movies: popularResponse?.data.results ?? null,
    movieDetail: detailResponse?.data ?? null,
  };
  const renderedApp = renderToString(<App initialData={initialData} />);

  const ogTags = initialData.movieDetail
    ? /*html*/ `
      <meta property="og:title" content="${initialData.movieDetail.title}" />
      <meta property="og:image" content="https://image.tmdb.org/t/p/original${initialData.movieDetail.poster_path}" />
      <meta property="og:description" content="${initialData.movieDetail.overview}" />
    `
    : '';
  const templateWithOGTags = template.replace('<!--{OG_TAGS}-->', ogTags);
  const renderedHTMLWithInitialData = templateWithOGTags.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
    </script>
  `,
  );
  const renderedHTML = renderedHTMLWithInitialData.replace(
    '<!--{BODY_AREA}-->',
    renderedApp,
  );

  res.send(renderedHTML);
});

export default router;
