import { useState } from 'react';
import MovieHomePage from './MovieHomePage';
import type { MovieItem } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';

type Props = {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
};

export default function MovieDetailPage({ movies, movieDetail }: Props) {
  const [isDetailOpen, setIsDetailOpen] = useState(true);

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    window.history.replaceState(null, '', '/');
  };

  return (
    <>
      <MovieHomePage movies={movies} />
      {isDetailOpen && (
        <MovieDetailModal movie={movieDetail} onClose={handleCloseDetail} />
      )}
    </>
  );
}
