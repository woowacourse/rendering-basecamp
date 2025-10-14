import { useState, useEffect } from "react";
import { moviesApi } from "../../api/movies";
import { MovieItem } from "../../types/Movie.types";

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const usePopularMovies = (moviesServerData: MovieItem[] | null) => {
  const [data, setData] = useState<MovieItem[] | null>(moviesServerData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      console.log({ data });

      if (data) return;

      setIsLoading(true);
      setError(null);

      try {
        const movies = await moviesApi.getPopular();
        setData(movies.data.results);
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
