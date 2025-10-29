import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import MovieHomePage from './MovieHomePage';
import { MovieItem } from '../types/Movie.types';
import { MovieDetailResponse } from '../types/MovieDetail.types';

export default function MovieDetailPage({
  initialData,
}: {
  initialData: {
    movies: MovieItem[];
    movie: MovieDetailResponse;
  };
}) {
  return (
    <>
      <MovieHomePage initialData={initialData} />
      <DetailPageOpenModal movie={initialData.movie} />
    </>
  );
}

function DetailPageOpenModal({ movie }: { movie: MovieDetailResponse }) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movie.id == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(movie);
    })();
  }, [movie.id, openMovieDetailModal]);

  return null;
}
