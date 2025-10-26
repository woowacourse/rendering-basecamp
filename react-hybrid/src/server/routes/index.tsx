import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { getMovieList } from '../api/getMovieList';
import { getMovieDetail } from '../api/getMovieDetail';
import { generateOgTags } from '../utils/generateOgTags';

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
  const movieList = await getMovieList();

  const renderedApp = renderToString(<App movies={movieList} />);

  const renderedHTMLWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movieList)}
      }
    </script>
  `
  );
  const renderedHTML = renderedHTMLWithInitialData.replace('<!--{BODY_AREA}-->', renderedApp);
  const renderHTMLWithOGTag = renderedHTML.replace(
    '<!--{OG_TAGS}-->',
    generateOgTags({
      title: 'REACT-HYBRID 영화 리뷰',
      description: '영화 목록을 HYBRID로 즐겨보세요!',
    })
  );

  res.send(renderHTMLWithOGTag);
});

router.get('/detail/:id', async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);
  const template = generateHTML();

  const [movieList, detail] = await Promise.all([getMovieList(), getMovieDetail(movieId)]);

  const renderedApp = renderToString(<App movies={movieList} />);

  const renderedHTMLWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movieList)},
        detail: ${JSON.stringify(detail)}
      }
    </script>
  `
  );
  const renderedHTML = renderedHTMLWithInitialData.replace('<!--{BODY_AREA}-->', renderedApp);
  const renderHTMLWithOGTag = renderedHTML.replace(
    '<!--{OG_TAGS}-->',
    generateOgTags({
      title: detail.title,
      description: detail.overview,
      image: detail.poster_path
        ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
        : '/images/no_image.png',
    })
  );

  res.send(renderHTMLWithOGTag);
});

export default router;
