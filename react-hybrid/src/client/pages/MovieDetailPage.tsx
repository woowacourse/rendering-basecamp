import MovieHomePage from './MovieHomePage';
import { MovieItem } from '../types/Movie.types';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { useState } from 'react';

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
        <MovieDetailModal
          movie={movieDetail}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
}
