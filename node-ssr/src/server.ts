import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { renderMovieList } from './templates/movieTemplate';

const app = express();
const PORT = 8080;

app.use(express.json());

// API 엔드포인트들
app.get('/api/movies', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const data = await moviesApi.getPopular(page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '영화 목록을 불러오는데 실패했습니다.' });
  }
});

app.get('/api/movies/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: '유효하지 않은 영화 ID입니다.' });
    }
    const data = await moviesApi.getDetail(id);
    return res.json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: '영화 상세 정보를 불러오는데 실패했습니다.' });
  }
});

// SSR 메인 페이지
app.get('/', async (_req: Request, res: Response) => {
  try {
    const movieData = await moviesApi.getPopular(1);
    const html = renderMovieList(movieData);
    res.send(html);
  } catch (error) {
    res.status(500).send('영화 목록을 불러오는데 실패했습니다.');
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
