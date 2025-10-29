import { useState, useEffect } from "react";
import { moviesApi } from "../../api/movies";
import { MovieItem } from "../../types/Movie.types";

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const usePopularMovies = (initialMovies?: MovieItem[]) => {
  // SSR 데이터가 있으면 초기값으로 사용
  const initialData =
    (typeof window !== "undefined" &&
      (window as any).__INITIAL_DATA__?.movies) ||
    initialMovies;
  const [data, setData] = useState<MovieItem[] | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // SSR 데이터가 있으면 API 호출 생략
    if (initialData) {
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
            : new Error("영화 정보를 불러오는데 실패했습니다.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, [initialData]);

  return { data, isLoading, error };
};
