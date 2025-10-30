import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { moviesApi } from '../../client/api/movies';

const router = Router();

interface OGTagsParams {
  title: string;
  description: string;
  image?: string;
  url: string;
}

function generateOGTags({ title, description, image, url }: OGTagsParams) {
  const imageUrl = image
    ? `https://image.tmdb.org/t/p/w500${image}`
    : 'https://image.tmdb.org/t/p/w500/default.jpg';

  return /*html*/ `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="http://localhost:3000${url}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
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

router.get('/', async (req: Request, res: Response) => {
  try {
    const response = await moviesApi.getPopular();
    const movies = response.data.results;

    if (!movies || movies.length === 0) {
      throw new Error('영화 데이터를 불러올 수 없습니다.');
    }

    const template = generateHTML();

    // 메인 페이지 OG 태그 생성
    const ogTags = generateOGTags({
      title: '인기 영화 - 영화 리뷰',
      description: '지금 인기 있는 영화를 확인하세요',
      image: movies[0]?.poster_path,
      url: '/',
    });

    const renderedApp = renderToString(<App movies={movies} />);

    const renderedHTMLWithOG = template.replace('<!--{OG_TAGS}-->', ogTags);

    const renderedHTMLWithInitialData = renderedHTMLWithOG.replace(
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
    console.error('메인 페이지 렌더링 에러:', error);
    res.status(500).send(/*html*/ `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>오류 발생</title>
        </head>
        <body>
          <h1>페이지를 불러오는 중 오류가 발생했습니다.</h1>
          <p>잠시 후 다시 시도해주세요.</p>
        </body>
      </html>
    `);
  }
});

router.get('/detail/:id', async (req, res) => {
  try {
    const movieId = req.params.id;

    if (!movieId || isNaN(Number(movieId))) {
      res.status(400).send(/*html*/ `
        <!DOCTYPE html>
        <html lang="ko">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>잘못된 요청</title>
          </head>
          <body>
            <h1>잘못된 영화 ID입니다.</h1>
            <p><a href="/">메인 페이지로 돌아가기</a></p>
          </body>
        </html>
      `);
      return;
    }

    const [moviesResponse, movieDetailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    const movies = moviesResponse.data.results;
    const movieDetail = movieDetailResponse.data;

    if (!movieDetail) {
      throw new Error('영화 상세 정보를 불러올 수 없습니다.');
    }

    const template = generateHTML();

    // 상세 페이지 OG 태그 생성
    const ogTags = generateOGTags({
      title: `${movieDetail.title} - 영화 리뷰`,
      description:
        movieDetail.overview || '영화 상세 정보를 확인하세요',
      image: movieDetail.poster_path,
      url: `/detail/${movieId}`,
    });

    const renderedApp = renderToString(
      <App movies={movies} movieDetail={movieDetail} />
    );

    const renderedHTMLWithOG = template.replace('<!--{OG_TAGS}-->', ogTags);

    const renderedHTMLWithInitialData = renderedHTMLWithOG.replace(
      '<!--{INIT_DATA_AREA}-->',
      /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(movies)},
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
    console.error('상세 페이지 렌더링 에러:', error);
    res.status(500).send(/*html*/ `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>오류 발생</title>
        </head>
        <body>
          <h1>페이지를 불러오는 중 오류가 발생했습니다.</h1>
          <p><a href="/">메인 페이지로 돌아가기</a></p>
        </body>
      </html>
    `);
  }
});

export default router;
