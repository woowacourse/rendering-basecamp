import { useState } from 'react';
import MovieHomePage from './MovieHomePage';
import { MovieDetailModal } from '../components/MovieDetailModal';
import type { MovieItem } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';

interface MovieDetailPageProps {
  movies: MovieItem[];
  movie: MovieDetailResponse;
}

export default function MovieDetailPage({ movies, movie }: MovieDetailPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    history.replaceState(null, '', '/');
    setIsModalOpen(false);
  };

  return (
    <>
      <MovieHomePage movies={movies} />
      {isModalOpen && <MovieDetailModal movie={movie} onClose={closeModal} />}
    </>
  );
}
