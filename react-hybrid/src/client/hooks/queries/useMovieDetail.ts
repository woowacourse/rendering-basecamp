import { useState, useEffect } from 'react';
import { moviesApi } from '../../api/movies';
import { MovieDetailResponse } from '../../types/MovieDetail.types';

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const useMovieDetail = (
  id: number,
  movieServerData?: MovieDetailResponse,
) => {
  const [data, setData] = useState<MovieDetailResponse | null>(movieServerData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log(id);
    if (!id) return;

    const fetchMovieDetail = async () => {
      console.log(id);
      setIsLoading(true);
      setError(null);

      try {
        const movieDetail = await moviesApi.getDetail(id);
        setData(movieDetail.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('영화 상세 정보를 불러오는데 실패했습니다.'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  return { data, isLoading, error };
};
