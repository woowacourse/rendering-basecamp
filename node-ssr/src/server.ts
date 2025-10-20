import dotenv from 'dotenv';

dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { isAxiosError } from 'axios';
import { moviesApi } from './service/tmdbApi';
import type { Movie } from './service/types';
import { getDetail } from './templates/getDetail';
import { getHome } from './templates/getHome';

const app = express();
const PORT = 8080;

app.use(express.json());

const fetchPopularMovies = async (): Promise<Movie[]> => {
  const response = await moviesApi.getPopular();
  return response.results ?? [];
};

app.get('/', async (_req: Request, res: Response) => {
  try {
    const movies = await fetchPopularMovies();
    res.status(200).send(getHome(movies));
  } catch (error) {
    console.error('인기 영화 목록 조회 실패:', error);
  }
});

app.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const movieId = Number.parseInt(req.params.id, 10);
    const [movies, detail] = await Promise.all([
      fetchPopularMovies(),
      moviesApi.getDetail(movieId),
    ]);
    res.status(200).send(getDetail(movies, detail));
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      res.status(404).send('요청하신 영화를 찾을 수 없습니다.');
      return;
    }
  }
});

app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
