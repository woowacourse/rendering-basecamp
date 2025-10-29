import { useState, useEffect } from "react";
import { moviesApi } from "../../api/movies";
import type { MovieItem } from "../../types/Movie.types";

/**
 * 영화 상세 정보를 조회하는 훅
 */

export const usePopularMovies = () => {
  const [data, setData] = useState<MovieItem[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.__INITIAL_DATA__ &&
      window.__INITIAL_DATA__.movies
    ) {
      const initialData = window.__INITIAL_DATA__.movies;
      window.__INITIAL_DATA__.movies = undefined;
      setData(initialData);
      return;
    }

    const fetchPopularMovies = async () => {
      if (data && data.length > 0) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const movieDetail = await moviesApi.getPopular();
        setData(movieDetail.data.results);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("영화 정보를 불러오는데 실패했습니다."),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, [data]);

  return { data, isLoading, error };
};
