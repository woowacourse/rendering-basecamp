import { useState, useEffect } from 'react';
import { moviesApi } from '../../api/movies';
import { MovieItem } from '../../types/Movie.types';

export const usePopularMovies = () => {
  const [movies, setMovies] = useState<MovieItem[]>(() => {
    // 서버면 global, 클라이언트면 window 확인
    const initialData = typeof window !== 'undefined' ? window.__INITIAL_DATA__ : (global as any).__INITIAL_DATA__;

    if (initialData?.movies) {
      return initialData.movies;
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (movies.length > 0) {
      return;
    }

    setIsLoading(true);
    moviesApi
      .getPopular(1)
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.error('Failed to fetch movies:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { data: movies, isLoading };
};
