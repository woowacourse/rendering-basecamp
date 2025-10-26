import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';
import MovieHomePage from '../../client/pages/MovieHomePage';
import MovieDetailPage from '../../client/pages/MovieDetailPage';
import { MovieItem } from '../../client/types/Movie.types';
import { MovieDetailResponse } from '../../client/types/MovieDetail.types';

const router = Router();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function generateOGTags({
  title,
  description,
  image,
  url,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
}) {
  return /*html*/ `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="website" />
  `;
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

router.get('/', async (_: Request, res: Response) => {
  try {
    const response = await moviesApi.getPopular();
    const movies = response.data.results;

    const template = generateHTML();

    const renderedApp = renderToString(<MovieHomePage movies={movies} />);

    // 홈페이지 OG 태그 생성
    const ogImage = `${BASE_URL}/images/logo.png`;
    const ogTitle = '영화 리뷰 - 인기 영화를 확인하고 평가해보세요';
    const ogDescription =
      '인기 있는 영화를 확인하고, 관람 후 별점을 남겨보세요. 최신 영화 정보와 트레일러를 한눈에 볼 수 있습니다.';
    const ogUrl = `${BASE_URL}/`;

    const ogTags = generateOGTags({
      title: ogTitle,
      description: ogDescription,
      image: ogImage,
      url: ogUrl,
    });

    const renderedHTMLWithOGTags = template.replace('<!--{OG_TAGS}-->', ogTags);

    const renderedHTMLWithInitialData = renderedHTMLWithOGTags.replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = {
          movies: ${JSON.stringify(movies)}
        }
      </script>
    `
    );
    const renderedHTML = renderedHTMLWithInitialData.replace(
      '<!--{BODY_AREA}-->',
      renderedApp
    );

    res.send(renderedHTML);
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    res.status(500).send('영화 정보를 불러오는데 실패했습니다.');
  }
});

// 영화 상세 페이지 라우트
router.get('/detail/:movieId', async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.movieId);

    if (isNaN(movieId)) {
      return res.status(400).send('Invalid movie ID');
    }

    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);

    const movies = popularResponse.data.results;
    const movieDetail = detailResponse.data;

    const template = generateHTML();

    const renderedApp = renderToString(
      <MovieDetailPage
        movies={movies}
        movieId={movieId}
        movieDetail={movieDetail}
      />
    );

    // OG 태그 생성 (영화 상세 정보 사용)
    const ogImage = movieDetail.backdrop_path
      ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movieDetail.backdrop_path}`
      : movieDetail.poster_path
      ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
      : '/images/logo.png';
    const ogTitle = `${movieDetail.title} - 영화 리뷰`;
    const ogDescription =
      movieDetail.overview ||
      movieDetail.tagline ||
      '영화 상세 정보를 확인해보세요.';
    const ogUrl = `${BASE_URL}/detail/${movieId}`;

    const ogTags = generateOGTags({
      title: ogTitle,
      description: ogDescription.substring(0, 200),
      image: ogImage,
      url: ogUrl,
    });

    const renderedHTMLWithOGTags = template.replace('<!--{OG_TAGS}-->', ogTags);

    const renderedHTMLWithInitialData = renderedHTMLWithOGTags.replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
      <script>
        window.__INITIAL_DATA__ = {
          movies: ${JSON.stringify(movies)},
          movieId: ${movieId},
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
  } catch (error) {
    console.error('Failed to fetch movie detail:', error);
    res.status(500).send('영화 상세 정보를 불러오는데 실패했습니다.');
  }
});

export default router;
