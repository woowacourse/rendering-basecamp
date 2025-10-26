import { useEffect } from 'react';
import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { MovieItem } from '../types/Movie.types';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import MovieHomePage from './MovieHomePage';

interface MovieDetailPageProps {
  movies: MovieItem[];
  detail: MovieDetailResponse
}

export default function MovieDetailPage({ movies, detail }: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal detail={detail} />
    </>
  );
}

interface DetailPageOpenModalProps {
  detail: MovieDetailResponse
}

function DetailPageOpenModal({ detail }: DetailPageOpenModalProps) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    (async () => {
      openMovieDetailModal(detail);
    })();
  }, [openMovieDetailModal]);

  return null;
}
