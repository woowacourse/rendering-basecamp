import axios from 'axios';
import type { MovieDetailResponse } from '../../client/types/MovieDetail.types';
import type { MovieResponse } from '../../client/types/Movie.types';

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

if (!TMDB_ACCESS_TOKEN) {
  console.warn('TMDB_ACCESS_TOKEN 환경변수가 설정되지 않았습니다.');
}

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
  },
});

export const tmdbApi = {
  async getPopular(page: number = 1): Promise<MovieResponse> {
    const response = await tmdbClient.get<MovieResponse>(
      `/movie/popular?page=${page}&language=ko-KR`
    );

    return response.data;
  },

  async getDetail(movieId: number): Promise<MovieDetailResponse> {
    const response = await tmdbClient.get<MovieDetailResponse>(
      `/movie/${movieId}?language=ko-KR`
    );

    return response.data;
  },
} as const;
