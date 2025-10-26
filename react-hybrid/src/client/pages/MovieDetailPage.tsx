import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import MovieHomePage from './MovieHomePage';
import { moviesApi } from '../api/movies';
import { MovieItem } from "../types/Movie.types";

interface MovieDetailPageProps {
  movieId: string;
  movies: MovieItem[];
}

export default function MovieDetailPage({ movieId, movies }: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal movieId={movieId} />
    </>
  );
}

interface DetailPageOpenModalProps {
  movieId: string;
}

function DetailPageOpenModal({movieId}: DetailPageOpenModalProps) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, openMovieDetailModal]);

  return null;
}
