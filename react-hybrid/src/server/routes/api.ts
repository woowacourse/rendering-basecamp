import axios from 'axios';
import { Router, type Request, type Response } from 'express';
import { tmdbApi } from '../service/tmdbApi';

const apiRouter = Router();

apiRouter.get('/movies/popular', async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);

  if (!Number.isSafeInteger(page) || page <= 0) {
    res.status(400).json({ message: '올바르지 않은 페이지입니다.' });
    return;
  }

  try {
    res.json(await tmdbApi.getPopular(page));
  } catch (error) {
    console.error('인기 영화 API 요청에 실패했습니다.', error);
    res.status(502).json({ message: '영화 정보를 불러오지 못했습니다.' });
  }
});

apiRouter.get('/movies/:id', async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    res.status(404).json({ message: '존재하지 않는 영화입니다.' });
    return;
  }

  try {
    res.json(await tmdbApi.getDetail(movieId));
  } catch (error) {
    const statusCode =
      axios.isAxiosError(error) && error.response?.status === 404 ? 404 : 502;

    console.error(`영화 상세 API 요청에 실패했습니다. (ID: ${movieId})`, error);
    res.status(statusCode).json({
      message:
        statusCode === 404
          ? '존재하지 않는 영화입니다.'
          : '영화 정보를 불러오지 못했습니다.',
    });
  }
});

export default apiRouter;
