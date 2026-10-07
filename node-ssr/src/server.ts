import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { renderIndex } from './render/renderIndex';

const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', async (_req: Request, res: Response) => {
  try {
    const popularMovies = await moviesApi.getPopular();

    const html = renderIndex(popularMovies.results);

    res.send(html);
  } catch (error) {
    console.error('영화 페이지 렌더링 실패:', error);
    res.sendStatus(500);
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
