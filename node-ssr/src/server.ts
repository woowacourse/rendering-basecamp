import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { getIndexHtml } from './html/getIndexHtml';
import { getDetailHtml } from './html/getDetailHtml';

const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', async (_req: Request, res: Response) => {
  try {
    const { results: movies } = await moviesApi.getPopular();
    const featuredMovie = movies[0];
    const html = getIndexHtml({ movies, featuredMovie });
    res.send(html);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).send('영화 정보를 불러오는데 실패했습니다.');
  }
});

app.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.id);
    const movie = await moviesApi.getDetail(movieId);

    const html = getDetailHtml({ movie, baseUrl: 'https://api.themoviedb.org/3' });
    res.send(html);
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    res.status(500).send('영화 상세 정보를 불러오는데 실패했습니다.');
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
