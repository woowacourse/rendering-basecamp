import { useState, useEffect } from "react";
import { moviesApi } from "../../api/movies";
import { MovieItem } from "../../types/Movie.types";
import { useInitialData } from "../../lib/InitialDataContext";

export const usePopularMovies = () => {
  const ssrData = useInitialData();

  const hasSSRMovies = ssrData?.movies != null && ssrData.movies.length > 0;

  const [data, setData] = useState<MovieItem[] | null>(
    hasSSRMovies ? (ssrData!.movies as MovieItem[]) : null
  );

  const [isLoading, setIsLoading] = useState<boolean>(
    hasSSRMovies ? false : true
  );

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (hasSSRMovies) return;

    const fetchPopularMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

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
  }, [hasSSRMovies]);

  return { data, isLoading, error };
};
