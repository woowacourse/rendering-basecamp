import { useState, useEffect } from "react";
import { moviesApi } from "../../api/movies";
import { MovieItem } from "../../types/Movie.types";

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const usePopularMovies = (movies?: MovieItem[]) => {
  const serverData = movies;
  const clientData =
    typeof window !== "undefined"
      ? window.__INITIAL_DATA__?.movies || null
      : null;

  const initialData = serverData || clientData;

  const [data, setData] = useState<MovieItem[] | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (data) {
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
  }, [data]);

  return { data, isLoading, error };
};
