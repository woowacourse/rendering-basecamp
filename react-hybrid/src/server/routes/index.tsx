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
  // 영화 목록 조회
  const { data } = await moviesApi.getPopular();
  const movies = data.results;

  const template = generateHTML();

  // React 컴포넌트를 HTML 문자열로 변환
  const renderedApp = renderToString(<App movies={movies} />);

  const renderedHTMLWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)}
      }
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
  const movieId = Number(req.params.id);

  const [{ data: popularData }, { data: detailData }] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);

  const movies = popularData.results;
  const movieDetail = detailData;

  const siteUrl = 'https://rendering-basecamp-dsbs.onrender.com/';
  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : `${siteUrl}/images/no_image.png`;

  const ogTags = /*html*/ `
    <title>${movieDetail.title}</title>
    <meta property="og:title" content="${movieDetail.title}" />
    <meta property="og:description" content="${movieDetail.overview.trim() || `${movieDetail.title} 영화 상세 정보`}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${siteUrl}/detail/${movieDetail.id}" />
  `;

  const template = generateHTML();

  // React 컴포넌트를 HTML 문자열로 변환
  const renderedApp = renderToString(
    <App movies={movies} movieDetail={movieDetail} />,
  );

  const renderedHTMLWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)},
        movieDetail: ${JSON.stringify(movieDetail)}
      }
    </script>
  `,
  );
  const renderedHTML = renderedHTMLWithInitialData
    .replace('<!--{BODY_AREA}-->', renderedApp)
    .replace('<!--{OG_TAGS}-->', ogTags);

  res.send(renderedHTML);
});

export default router;
