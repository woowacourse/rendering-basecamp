import { useState } from 'react';
import { MovieDetailModal } from '../components/MovieDetailModal';
import MovieHomePage from './MovieHomePage';
import type { MovieItem } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';

export default function MovieDetailPage({
  movies,
  movieDetail,
}: {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <MovieHomePage movies={movies} />
      {isOpen && (
        <MovieDetailModal movie={movieDetail} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
