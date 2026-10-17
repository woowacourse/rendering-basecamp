import { useState } from 'react';
import MovieHomePage from './MovieHomePage';
import { MovieDetailModal } from '../components/MovieDetailModal';
import type { MovieItem } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';

interface MovieDetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

export default function MovieDetailPage({ movies, movieDetail }: MovieDetailPageProps) {
  // 서버가 모달까지 그려서 보내므로, 클라이언트도 "열린 상태"로 시작해야 hydration 결과가 일치한다.
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
    window.history.replaceState(null, '', '/');
  };

  return (
    <>
      <MovieHomePage movies={movies} />
      {isModalOpen && <MovieDetailModal movie={movieDetail} onClose={handleClose} />}
    </>
  );
}
