import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';

const router = Router();

function escapeHtml(str: string): string {
  if (!str) return '';

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function serializeForScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

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

const renderHome = async (_: Request, res: Response) => {
  const template = generateHTML();
  try {
    const popularMovies = await moviesApi.getPopular();
    const movies = popularMovies.data?.results ?? [];

    const renderedApp = renderToString(<App initialMovies={movies} />);

    const renderedHTMLWithInitialData = template.replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
        <script>
          window.__INITIAL_DATA__ = ${serializeForScript({ movies })};
        </script>
      `
    );
    const renderedHTML = renderedHTMLWithInitialData.replace(
      '<!--{BODY_AREA}-->',
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error(error);
    res.status(500).send('영화 데이터를 불러오는 중 오류가 발생했습니다.');
  }
};

const renderDetail = async (req: Request, res: Response) => {
  try {
    const movieId = Number(req.params.movieId);

    if (Number.isNaN(movieId)) {
      res.status(404).send('잘못된 영화 ID 입니다.');
      return;
    }

    const [popularMovies, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    const movies = popularMovies.data?.results ?? [];
    const detailMovie = detailResponse.data;
    const requestPath = req.originalUrl || `/detail/${movieId}`;

    const baseUrl = process.env.BASE_URL || '';
    const fallbackBaseUrl = baseUrl || 'https://blissful-liberation-production.up.railway.app';
    const imageUrl = detailMovie.poster_path
      ? `https://image.tmdb.org/t/p/w500${detailMovie.poster_path}`
      : `${fallbackBaseUrl}/images/no_image.png`;

    const ogTitle = escapeHtml(detailMovie.title ?? '');
    const ogDescription = escapeHtml(detailMovie.overview || '영화 상세 정보');
    const ogImage = escapeHtml(imageUrl);
    const ogUrl = escapeHtml(`${baseUrl}${requestPath}`);

    const ogTags = `
      <meta property="og:title" content="${ogTitle}" />
      <meta property="og:description" content="${ogDescription}" />
      <meta property="og:image" content="${ogImage}" />
      <meta property="og:url" content="${ogUrl}" />
    `;

    const renderedApp = renderToString(
      <App
        initialMovies={movies}
        initialDetailMovie={detailMovie}
        initialPath={requestPath} //서버 렌더링 시 현재 요청 경로를 넘겨서 라우터 위치를 맞추는 용도
      />
    );

    let template = generateHTML();

    template = template.replace('<!--{OG_TAGS}-->', ogTags);

    const withData = template.replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
        <script>
          window.__INITIAL_DATA__ = ${serializeForScript({
            movies,
            detailMovie,
          })};
        </script>
      `
    );

    const html = withData.replace('<!--{BODY_AREA}-->', renderedApp);

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('영화 데이터를 불러오는 중 오류가 발생했습니다.');
  }
};

router.get('/', renderHome);
router.get('/detail/:movieId', renderDetail);

export default router;
