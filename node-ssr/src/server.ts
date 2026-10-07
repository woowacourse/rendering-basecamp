import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { Movie, MovieDetailResponse } from './service/types';
import axios from 'axios';
import { render } from './render';

const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', async (_req: Request, res: Response) => {
  let results: Movie[];

  try {
    ({ results } = await moviesApi.getPopular());
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return res.status(404).send('영화를 찾을 수 없습니다.');
    }
    console.error('영화 불러오기에 실패하였습니다.', error);
    throw error;
  }

  return res.send(/*html*/ `
    <!DOCTYPE html>
    <html lang="ko">

    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/styles/index.css" />
      <title>영화 리뷰</title>
    </head>

    <body>
      ${render.homeElement(results)}
    </body>

    </html>
        `);
});

app.get('/detail/:id', async (_req: Request, res: Response) => {
  const movieId = Number(_req.params.id);
  const protocol = _req.get('x-forwarded-proto') ?? _req.protocol;
  const origin = `${protocol}://${_req.get('host')}`;

  let results: Movie[];
  let movieDetail: MovieDetailResponse;
  let imageUrl: string;

  try {
    ({ results } = await moviesApi.getPopular());
    movieDetail = await moviesApi.getDetail(movieId);
    imageUrl = movieDetail.poster_path
      ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
      : `${origin}/images/no_image.png`;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return res.status(404).send('영화를 찾을 수 없습니다.');
    }
    console.error('영화 불러오기에 실패하였습니다.', error);
    throw error;
  }

  return res.send(/*html*/ `
        <!DOCTYPE html>
    <html lang="ko">

    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${movieDetail.overview}" />
      <meta property="og:image" content=${imageUrl} />
      <link rel="stylesheet" href="/styles/index.css" />
      <title>영화 리뷰</title>
    </head>

    <body>
      ${render.homeElement(results)}
      ${render.modalElement(movieDetail)}
    </body>

    </html>
    `);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
