import type { MovieItem, MovieResponse } from '@/types/Movie.types';
import type { MovieDetailResponse } from '@/types/MovieDetail.types';
import type { QueryResult } from '@/types/Query.types';

async function fetchMovie<T>(path: string): Promise<T | null> {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) throw new Error('TMDB_ACCESS_TOKEN이 설정되지 않았습니다.');

  const response = await fetch(`https://api.themoviedb.org/3/movie/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('영화 API 요청 실패');

  return response.json();
}

export async function getPopularMovies(): Promise<QueryResult<MovieItem[]>> {
  try {
    const movies = await fetchMovie<MovieResponse>('popular?page=1&language=ko-KR');

    if (!movies || !Array.isArray(movies.results) || movies.results.length === 0) {
      throw new Error('영화 목록이 없습니다.');
    }

    return { data: movies.results, error: null };
  } catch {
    return {
      data: null,
      error: { status: 502, message: '영화 목록을 불러오는데 실패했습니다.' },
    };
  }
}

export async function getMovieDetail(id: string): Promise<QueryResult<MovieDetailResponse>> {
  try {
    const movie = await fetchMovie<MovieDetailResponse>(`${id}?language=ko-KR`);

    if (!movie) {
      return { data: null, error: { status: 404, message: '영화 정보를 찾을 수 없습니다.' } };
    }

    return { data: movie, error: null };
  } catch {
    return {
      data: null,
      error: { status: 502, message: '영화 정보를 불러오는데 실패했습니다.' },
    };
  }
}
