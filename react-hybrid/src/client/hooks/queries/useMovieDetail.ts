import { useState, useEffect } from 'react';
import { moviesApi } from '../../api/movies';
import { MovieDetailResponse } from '../../types/MovieDetail.types';

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const useMovieDetail = (
  id: number | undefined,
  initialMovieDetail: MovieDetailResponse | null = null,
) => {
  const [data, setData] = useState<MovieDetailResponse | null>(initialMovieDetail);
  const [isLoading, setIsLoading] = useState(initialMovieDetail === null && !!id);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialMovieDetail !== null || !id) return;

    let cancelled = false;

    const fetchMovieDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const movieDetail = await moviesApi.getDetail(id);
        if (cancelled) return;
        setData(movieDetail.data);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err
            : new Error('영화 상세 정보를 불러오는데 실패했습니다.')
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchMovieDetail();
    return () => {
      cancelled = true;
    };
  }, [id, initialMovieDetail]);

  return { data, isLoading, error };
};
