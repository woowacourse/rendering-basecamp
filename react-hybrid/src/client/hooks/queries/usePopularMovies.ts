import { useState, useEffect } from 'react';
import { moviesApi } from '../../api/movies';
import { MovieItem } from '../../types/Movie.types';

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const usePopularMovies = (initialMovies?: MovieItem[]) => {
  const [data, setData] = useState<MovieItem[] | null>(initialMovies ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialMovies && initialMovies.length > 0) {
      setData(initialMovies);
      return;
    }

    const fetchPopularMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const movieDetail = await moviesApi.getPopular();
        setData(movieDetail.data.results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('영화 정보를 불러오는데 실패했습니다.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, [initialMovies]);

  return { data, isLoading, error };
};
