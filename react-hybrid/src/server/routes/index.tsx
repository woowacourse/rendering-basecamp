import axios from 'axios';
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

router.get('/detail/:id', async (req: Request, res: Response) => {
  const movieId = Number(req.params.id);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    res.status(404).type('text').send('존재하지 않는 영화입니다.');
    return;
  }

  const [popularResult, detailResult] = await Promise.allSettled([
    tmdbApi.getPopular(),
    tmdbApi.getDetail(movieId),
  ]);

  if (popularResult.status === 'rejected') {
    console.error('영화 상세 SSR의 인기 영화 요청에 실패했습니다.', popularResult.reason);
  }

  if (detailResult.status === 'rejected') {
    console.error(
      `영화 상세 SSR의 상세 정보 요청에 실패했습니다. (ID: ${movieId})`,
      detailResult.reason
    );
  }

  if (detailResult.status === 'rejected') {
    const statusCode =
      axios.isAxiosError(detailResult.reason) &&
      detailResult.reason.response?.status === 404
        ? 404
        : 502;

    res
      .status(statusCode)
      .type('text')
      .send(
        statusCode === 404
          ? '존재하지 않는 영화입니다.'
          : '영화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      );
    return;
  }

  if (popularResult.status === 'rejected') {
    res
      .status(502)
      .type('text')
      .send('영화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    return;
  }

  const movieDetail = detailResult.value;
  const initialData: InitialData = {
    movies: popularResult.value.results,
    movieDetail,
  };
  const imagePath = movieDetail.backdrop_path ?? movieDetail.poster_path;

  res.type('html').send(
    renderDocument(initialData, {
      title: `${movieDetail.title} | 영화 리뷰`,
      description: movieDetail.overview || '영화 상세 정보를 확인해 보세요.',
      image: imagePath
        ? `https://image.tmdb.org/t/p/w1280${imagePath}`
        : undefined,
    })
  );
});

export default router;
