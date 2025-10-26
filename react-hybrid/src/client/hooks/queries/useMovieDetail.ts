import { useState, useEffect } from 'react';
import { moviesApi } from '../../api/movies';
import { MovieDetailResponse } from '../../types/MovieDetail.types';

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const useMovieDetail = (id: number, movieDetail: MovieDetailResponse | null) => {
  const [data, setData] = useState<MovieDetailResponse | null>(movieDetail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const movieDetail = await moviesApi.getDetail(id);
        setData(movieDetail.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('영화 상세 정보를 불러오는데 실패했습니다.')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  return { data, isLoading, error };
};
