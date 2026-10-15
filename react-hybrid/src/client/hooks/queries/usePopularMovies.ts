import { useState, useEffect } from "react";
import { moviesApi } from "../../api/movies";
import { MovieItem } from "../../types/Movie.types";

export const usePopularMovies = (initialMovies?: MovieItem[]) => {
  const hasInitialMovies = initialMovies !== undefined;

  const [data, setData] = useState<MovieItem[] | null>(initialMovies ?? null);
  const [isLoading, setIsLoading] = useState(!hasInitialMovies);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (hasInitialMovies) {
      return;
    }

    const fetchPopularMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await moviesApi.getPopular();
        setData(response.data.results);
      } catch (error) {
        setError(error instanceof Error ? error : new Error("영화 정보를 불러오는데 실패했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPopularMovies();
  }, [hasInitialMovies]);

  return { data, isLoading, error };
};
