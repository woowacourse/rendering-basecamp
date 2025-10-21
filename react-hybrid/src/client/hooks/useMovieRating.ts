import { useState, useCallback, useEffect } from 'react';
import { SessionStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storage';

type MovieRating = {
  movieId: number;
  movieName: string;
  rate: number;
  rateDate: Date;
};

export const useMovieRating = (movieId: number, movieName: string) => {
  const [rating, setRatingState] = useState<number>(0);

  const getRatings = useCallback((): MovieRating[] => {
    return SessionStorage.getItems<MovieRating>(STORAGE_KEYS.MOVIE_RATINGS);
  }, []);

  const saveRatings = useCallback((ratings: MovieRating[]) => {
    SessionStorage.saveItems(ratings, STORAGE_KEYS.MOVIE_RATINGS);
  }, []);

  const setRating = useCallback(
    (rate: number) => {
      const ratings = getRatings();
      const existingIndex = ratings.findIndex(
        (item) => item.movieId === movieId,
      );

      if (existingIndex > -1) {
        ratings[existingIndex].rate = rate;
      } else if (rate > 0) {
        ratings.push({
          movieId,
          movieName,
          rate,
          rateDate: new Date(),
        });
      }

      saveRatings(ratings);
      setRatingState(rate);
    },
    [movieId, movieName, getRatings, saveRatings],
  );

  useEffect(() => {
    const ratings = getRatings();
    const movieRating = ratings.find((item) => item.movieId === movieId);
    setRatingState(movieRating?.rate ?? 0);
  }, [movieId, getRatings]);

  return {
    rating,
    setRating,
  };
};
