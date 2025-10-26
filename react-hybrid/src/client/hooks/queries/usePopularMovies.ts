import { useState, useEffect } from 'react';
import { moviesApi } from '../../api/movies';
import { MovieItem } from '../../types/Movie.types';

/**
 * 인기 영화 목록을 조회하는 훅
 */
export const usePopularMovies = () => {
  const initialMovies =
    typeof window !== 'undefined' ? window.__INITIAL_DATA__?.movies : null;

  const [data, setData] = useState<MovieItem[] | null>(initialMovies || null);
  const [isLoading, setIsLoading] = useState(!initialMovies);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialMovies) {
      return;
    }

    const fetchPopularMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const movieDetail = await moviesApi.getPopular();
        setData(movieDetail.data.results);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('영화 정보를 불러오는데 실패했습니다.')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  return { data, isLoading, error };
};
