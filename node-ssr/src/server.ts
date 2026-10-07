import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { renderHome, renderModal } from './service/render';

const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', async (_req: Request, res: Response) => {
  const { results: movies } = await moviesApi.getPopular();

  res.send(renderHome(movies));
});

app.get('/detail/:id', async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);
  const movieDetail = await moviesApi.getDetail(movieId);
  const { results: movies } = await moviesApi.getPopular();

  res.send(renderHome(movies, renderModal(movieDetail), movieDetail));
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
