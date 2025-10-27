import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';
import renderTags from '../views/renderTags';
import renderHTML from '../views/renderHTML';
import { StaticRouter } from 'react-router-dom';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const popularMoviesResponse = await moviesApi.getPopular();
  const movies = popularMoviesResponse.data.results;
  const initialData = {
    movies,
    movieDetail: undefined,
  };
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  const renderedApp = renderToString(
    <StaticRouter location={req.originalUrl}>
      <App initialData={initialData} />
    </StaticRouter>
  );

  const metaTags = renderTags({
    title: '영화 리뷰',
    description: '인기 영화 정보를 확인할 수 있습니다.',
    image: `https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`,
    url,
  });

  const renderedHTML = renderHTML({
    renderApp: renderedApp,
    page: 'home',
    initialData,
    title: '영화 리뷰',
    metaTags,
  });

  res.send(renderedHTML);
});

router.get('/detail/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(id)),
  ]);
  const initialData = {
    movies: popularResponse.data.results,
    movieDetail: detailResponse.data,
  };
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const renderedApp = renderToString(
    <StaticRouter location={req.originalUrl}>
      <App initialData={initialData} />
    </StaticRouter>
  );

  const metaTags = renderTags({
    title: initialData.movieDetail.title,
    description: initialData.movieDetail.overview,
    image: `https://image.tmdb.org/t/p/original${initialData.movieDetail.backdrop_path}`,
    url,
  });

  const renderedHTML = renderHTML({
    renderApp: renderedApp,
    page: 'detail',
    initialData,
    title: initialData.movieDetail.title,
    metaTags,
  });

  res.send(renderedHTML);
});

export default router;
