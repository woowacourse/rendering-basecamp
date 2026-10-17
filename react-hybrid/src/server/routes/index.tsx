import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';
import type { MovieItem } from '../../client/types/Movie.types';
import type { MovieDetailResponse } from '../../client/types/MovieDetail.types';

const router = Router();

interface InitialData {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
}

interface PageMetadata {
  title: string;
  description: string;
  image?: string;
  type?: string;
}

const DEFAULT_METADATA: PageMetadata = {
  title: '영화 리뷰',
  description: '지금 인기 있는 영화를 확인하고 별점을 남겨보세요.',
  type: 'website',
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function generateHTML(metadata: PageMetadata = DEFAULT_METADATA) {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const type = escapeHtml(metadata.type ?? 'website');
  const imageTag = metadata.image
    ? `<meta property="og:image" content="${escapeHtml(metadata.image)}" />`
    : '';

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>${title}</title>
        <meta name="description" content="${description}" />
        <meta property="og:type" content="${type}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        ${imageTag}
      </head>
      <body>
        <div id="root"><!--{BODY_AREA}--></div>
        <!--{INIT_DATA_AREA}-->
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

function renderPage(
  initialData: InitialData,
  location: string,
  metadata?: PageMetadata,
) {
  const template = generateHTML(metadata);
  const renderedApp = renderToString(
    <StaticRouter location={location}>
      <App movies={initialData.movies} movieDetail={initialData.movieDetail} />
    </StaticRouter>,
  );

  return template
    .replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}
        </script>
      `,
    )
    .replace('<!--{BODY_AREA}-->', renderedApp);
}

router.get('/', async (_: Request, res: Response) => {
  try {
    const response = await moviesApi.getPopular();
    const movies = response.data.results;

    res.send(renderPage({ movies }, '/'));
  } catch (error) {
    console.error(error);
    res.status(500).send('영화 정보를 불러오지 못했습니다.');
  }
});

router.get('/detail/:movieId', async (req: Request, res: Response) => {
  const movieId = Number(req.params.movieId);

  if (!Number.isInteger(movieId) || movieId < 1) {
    res.status(400).send('잘못된 영화 ID입니다.');
    return;
  }

  try {
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    res.send(
      renderPage(
        {
          movies: popularResponse.data.results,
          movieDetail: detailResponse.data,
        },
        req.path,
        {
          title: `${detailResponse.data.title} | 영화 리뷰`,
          description:
            detailResponse.data.overview ||
            `${detailResponse.data.title}의 영화 정보를 확인해보세요.`,
          image: detailResponse.data.poster_path
            ? `https://image.tmdb.org/t/p/w500${detailResponse.data.poster_path}`
            : undefined,
          type: 'video.movie',
        },
      ),
    );
  } catch (error) {
    console.error(error);
    res.status(500).send('영화 정보를 불러오지 못했습니다.');
  }
});

export default router;
