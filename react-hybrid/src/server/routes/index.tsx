import { Router, Request, Response } from 'express';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import MovieHomePage from '../../client/pages/MovieHomePage';
import MovieDetailPage from '../../client/pages/MovieDetailPage';
import { moviesApi } from '../api/movie';

const router = Router();

function getBaseUrl(req: Request): string {
  // Railway나 프로덕션 환경
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  // 요청 헤더에서 host 가져오기
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

function generateHTML(
  body: string,
  initialData: any,
  url: string,
  ogTags?: {
    title?: string;
    description?: string;
    image?: string;
  },
  baseUrl: string = 'http://localhost:3000'
) {
  const ogTitle = ogTags?.title || '영화 리뷰';
  const ogDescription = ogTags?.description || '인기 영화를 확인하세요';
  const ogImage = ogTags?.image || `${baseUrl}/images/logo.png`;
  const ogUrl = `${baseUrl}${url}`;

  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles/index.css" />
        <title>영화 리뷰</title>

        <!-- Open Graph 태그 -->
        <meta property="og:type" content="website" />
        <meta property="og:title" content="${ogTitle}" />
        <meta property="og:description" content="${ogDescription}" />
        <meta property="og:image" content="${ogImage}" />
        <meta property="og:url" content="${ogUrl}" />
      </head>
      <body>
        <div id="root">${body}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
          window.__INITIAL_URL__ = "${url}";
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const moviesData = await moviesApi.getPopular(1);
    const baseUrl = getBaseUrl(req);
    const featuredMovie = moviesData.results[0];

    const renderedApp = renderToString(
      <OverlayProvider>
        <MovieHomePage />
      </OverlayProvider>
    );

    const html = generateHTML(
      renderedApp,
      { movies: moviesData.results, url: '/' },
      '/',
      {
        title: featuredMovie?.title || '영화 리뷰',
        description: featuredMovie?.overview || '지금 인기 있는 영화를 확인하세요',
        image: featuredMovie?.poster_path
          ? `https://image.tmdb.org/t/p/w500${featuredMovie.poster_path}`
          : `${baseUrl}/images/logo.png`,
      },
      baseUrl
    );

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const movieId = req.params.id;
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    const [moviesData, movieDetail] = await Promise.all([
      moviesApi.getPopular(1),
      moviesApi.getDetail(Number(movieId)),
    ]);

    const renderedApp = renderToString(
      <OverlayProvider>
        <MovieDetailPage />
      </OverlayProvider>
    );

    const html = `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="/styles/index.css" />
          <title>영화 리뷰</title>

          <meta property="og:type" content="website" />
          <meta property="og:title" content="${movieDetail.title}" />
          <meta property="og:description" content="${movieDetail.overview || '영화 상세 정보'}" />
          <meta property="og:image" content="https://image.tmdb.org/t/p/original${movieDetail.poster_path}" />
          <meta property="og:url" content="${baseUrl}/detail/${movieId}" />
        </head>
        <body>
          <div id="root">${renderedApp}</div>
          <script>
            window.__INITIAL_DATA__ = ${JSON.stringify({
              movies: moviesData.results,
              movieDetail: movieDetail,
              url: `/detail/${movieId}`,
            })};
            window.__INITIAL_URL__ = "/detail/${movieId}";
          </script>
          <script src="/bundle.js"></script>
        </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

export default router;
