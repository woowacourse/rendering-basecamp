import { PORT } from './config';

import express, { Request, Response } from 'express';
import path from 'path';
import { moviesApi } from './service/tmdbApi';
import { renderIndex } from './render/renderIndex';

const app = express();

app.use(express.json());

app.get(['/', '/detail/:id'], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id !== undefined && (!/^\d+$/.test(String(id)) || !Number.isSafeInteger(Number(id)) || Number(id) <= 0)) {
      res.sendStatus(400);
      return;
    }

    const [popularMovies, selectedMovie] = await Promise.all([
      moviesApi.getPopular(),
      id ? moviesApi.getDetail(Number(id)) : undefined,
    ]);

    const html = renderIndex(popularMovies.results, selectedMovie);

    res.send(html);
  } catch (error) {
    console.error('영화 페이지 렌더링 실패:', error);
    res.sendStatus(500);
  }
});

app.get('/api/movies/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!/^\d+$/.test(String(req.params.id)) || !Number.isSafeInteger(id) || id <= 0) {
    res.sendStatus(400);
    return;
  }

  try {
    const movie = await moviesApi.getDetail(id);
    res.json(movie);
  } catch (error) {
    console.error('영화 상세 조회 실패:', error);
    res.sendStatus(500);
  }
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
