import { useEffect, useState } from "react";
import { MovieItem } from "../../types/Movie.types";
import { moviesApi } from "../../api/movies";

export const usePopularMovies = (initialMovies: MovieItem[] = []) => {
  const [data, setData] = useState<MovieItem[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 이미 초기 데이터가 있으면 요청하지 않음
    if (initialMovies.length > 0) {
      return;
    }

    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await moviesApi.getPopular();
        setData(response.data.results);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { data, isLoading };
};
