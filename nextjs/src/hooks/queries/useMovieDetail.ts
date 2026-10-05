import { useState, useEffect } from 'react';
import { moviesApi } from '../../api/movies';
import { MovieDetailResponse } from '../../types/MovieDetail.types';

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const useMovieDetail = (id: number) => {
  const [data, setData] = useState<MovieDetailResponse | null>(null);
  // 첫 렌더링부터 로딩 상태로 시작해야 요청 전에 "찾을 수 없음" 화면이 잠깐 보이지 않는다.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    // 응답이 오기 전에 다른 영화로 바뀌면 이전 응답은 무시한다.
    let ignore = false;

    const fetchMovieDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const movieDetail = await moviesApi.getDetail(id);
        if (!ignore) setData(movieDetail.data);
      } catch (err) {
        if (ignore) return;
        setError(
          err instanceof Error
            ? err
            : new Error('영화 상세 정보를 불러오는데 실패했습니다.')
        );
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchMovieDetail();

    return () => {
      ignore = true;
    };
  }, [id]);

  return { data, isLoading, error };
};
