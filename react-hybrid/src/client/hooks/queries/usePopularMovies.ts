import { useState, useEffect } from "react";
import { moviesApi } from "../../api/movies";
import { MovieItem } from "../../types/Movie.types";

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const usePopularMovies = () => {
  const [data, setData] = useState<MovieItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.__INITIAL_DATA__?.movies) {
      setData(window.__INITIAL_DATA__.movies);
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
  }, []);

  return { data, isLoading, error };
};
