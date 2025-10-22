import { useState, useEffect } from 'react';
import { moviesApi } from '../../api/movies';
import { MovieItem } from '../../types/Movie.types';

export const usePopularMovies = () => {
  const [movies, setMovies] = useState<MovieItem[]>(() => {
    if (typeof window !== 'undefined' && window.__INITIAL_DATA__?.movies) {
      return window.__INITIAL_DATA__?.movies;
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
