import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import axios from 'axios';
import { moviesApi } from '../../client/api/movies';
import { MovieItem } from '../../client/types/Movie.types';

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
  let movies: MovieItem[];

  try {
    const { data } = await moviesApi.getPopular();
    movies = data.results;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return res.status(404).send('영화를 찾을 수 없습니다.');
    }
    console.error('영화 불러오기에 실패하였습니다.', error);
    throw error;
  }

  const template = generateHTML();

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
  const renderedHTML = renderedHTMLWithInitialData.replace('<!--{BODY_AREA}-->', renderedApp);

  res.send(renderedHTML);
});

export default router;
