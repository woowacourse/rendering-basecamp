import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';
import { generateMetaTags } from '../../client/utils/metaTags';

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
  try {
    const template = generateHTML();
    const popularResponse = await moviesApi.getPopular();
    const movies = popularResponse.data.results ?? [];
    const renderedApp = renderToString(<App initialMovies={movies} />);

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

    const metaTags = generateMetaTags();
    const renderedHTMLWithMetaTags = renderedHTMLWithInitialData.replace(
      '<!--{OG_TAGS}-->',
      metaTags,
    );
    const renderedHTML = renderedHTMLWithMetaTags.replace('<!--{BODY_AREA}-->', renderedApp);

    res.send(renderedHTML);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const movieId = Number(req.params.id);
    const template = generateHTML();

    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    const movies = popularResponse.data.results ?? [];
    const detail = detailResponse.data ?? null;

    const renderedHTMLWithInitialData = template.replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = {
          movies: ${JSON.stringify(movies)},
          detail: ${JSON.stringify(detail)}
        }
      </script>
    `,
    );

    const metaTags = generateMetaTags({
      title: detail?.title,
      description: detail?.overview,
      image: detail?.poster_path
        ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
        : undefined,
      url: `https://movie-review.com/detail/${detail?.id}`,
    });

    const renderedHTMLWithMetaTags = renderedHTMLWithInitialData.replace(
      '<!--{OG_TAGS}-->',
      metaTags,
    );

    const renderedApp = renderToString(<App initialMovies={movies} detail={detail} />);
    const renderedHTML = renderedHTMLWithMetaTags.replace('<!--{BODY_AREA}-->', renderedApp);

    res.send(renderedHTML);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
