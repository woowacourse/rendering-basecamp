import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { renderMovieListPage } from './templates/movieListTemplate';
import { renderMovieDetailPage } from './templates/movieDetailTemplate';

const app = express();
const PORT = 8080;

app.use(express.json());

// 메인 페이지 - 인기 영화 목록 SSR
app.get('/', async (_req: Request, res: Response) => {
  try {
    const movieData = await moviesApi.getPopular(1);
    const html = renderMovieListPage(movieData.results);
    res.send(html);
  } catch (error) {
    console.error('영화 목록 조회 실패:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <title>오류 발생</title>
        </head>
        <body>
          <h1>영화 목록을 불러오는데 실패했습니다.</h1>
          <p>잠시 후 다시 시도해주세요.</p>
        </body>
      </html>
    `);
  }
});

// 영화 상세 페이지 SSR
app.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.id, 10);

    if (isNaN(movieId)) {
      res.status(400).send(`
        <!DOCTYPE html>
        <html lang="ko">
          <head>
            <meta charset="UTF-8" />
            <title>잘못된 요청</title>
          </head>
          <body>
            <h1>잘못된 영화 ID입니다.</h1>
          </body>
        </html>
      `);
      return;
    }

    const movie = await moviesApi.getDetail(movieId);
    const html = renderMovieDetailPage(movie);
    res.send(html);
  } catch (error: any) {
    console.error('영화 상세 정보 조회 실패:', error);

    if (error.response?.status === 404) {
      res.status(404).send(`
        <!DOCTYPE html>
        <html lang="ko">
          <head>
            <meta charset="UTF-8" />
            <title>영화를 찾을 수 없습니다</title>
          </head>
          <body>
            <h1>영화를 찾을 수 없습니다.</h1>
            <p>요청하신 영화가 존재하지 않습니다.</p>
            <a href="/">홈으로 돌아가기</a>
          </body>
        </html>
      `);
    } else {
      res.status(500).send(`
        <!DOCTYPE html>
        <html lang="ko">
          <head>
            <meta charset="UTF-8" />
            <title>오류 발생</title>
          </head>
          <body>
            <h1>영화 정보를 불러오는데 실패했습니다.</h1>
            <p>잠시 후 다시 시도해주세요.</p>
            <a href="/">홈으로 돌아가기</a>
          </body>
        </html>
      `);
    }
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
