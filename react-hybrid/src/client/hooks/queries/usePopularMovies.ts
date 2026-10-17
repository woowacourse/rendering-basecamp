import { useState, useEffect } from 'react';
import { moviesApi } from '../../api/movies';
import { MovieItem } from '../../types/Movie.types';

/**
 * 인기 영화 목록을 조회하는 훅
 * 서버에서 받은 초기 데이터가 있으면 그대로 사용하고, 없을 때만 클라이언트에서 요청한다.
 */
export const usePopularMovies = (initialData?: MovieItem[]) => {
  const [data, setData] = useState<MovieItem[] | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(initialData == null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialData != null) return;

    const fetchPopularMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await moviesApi.getPopular();
        setData(response.data.results);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading, error };
};
