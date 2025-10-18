import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { html } from './html';

const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', async (_req: Request, res: Response) => {
  const movies = (await moviesApi.getPopular()).results;
  res.send(html.mainHtml(movies));
});

app.use(express.static(path.join(__dirname, '../public')));

app.get('/detail/:id', async (_req: Request, res: Response) => {
  const movies = (await moviesApi.getPopular()).results;

  const id = _req.params.id;
  const movie = await moviesApi.getDetail(Number(id));

  res.send(html.mainHtml(movies, html.makeMeta(movie), html.modalHtml(movie)));
});

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
