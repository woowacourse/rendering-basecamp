import { Router, Request, Response } from 'express';
import type { InitialData } from '../../client/types/InitialData.types';
import { tmdbApi } from '../service/tmdbApi';
import { renderDocument } from '../view/renderDocument';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const popularMovies = await tmdbApi.getPopular();
    const initialData: InitialData = { movies: popularMovies.results };

    res.type('html').send(renderDocument(initialData));
  } catch (error) {
    console.error('인기 영화 SSR에 실패했습니다.', error);
    res
      .status(502)
      .type('text')
      .send('영화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
});

export default router;
