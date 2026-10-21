import { useState } from 'react';
import MovieHomePage from './MovieHomePage';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { SITE_NAME } from '../constants/site';
import type { MovieSummary } from '../types/Movie.types';
import type { MovieDetail } from '../types/MovieDetail.types';

interface MovieDetailPageProps {
  movies: MovieSummary[];
  movie: MovieDetail;
}

export default function MovieDetailPage({ movies, movie }: MovieDetailPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    history.replaceState(null, '', '/');
    document.title = SITE_NAME;
    setIsModalOpen(false);
  };

  return (
    <>
      <MovieHomePage movies={movies} />
      {isModalOpen && <MovieDetailModal movie={movie} onClose={closeModal} />}
    </>
  );
}
