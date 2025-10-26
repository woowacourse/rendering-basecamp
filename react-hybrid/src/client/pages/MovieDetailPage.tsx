import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import MovieHomePage from './MovieHomePage';
import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";

interface MovieDetailPageProps {
  movieId: number;
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
}

export default function MovieDetailPage({ movieId, movies, movieDetail }: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

interface DetailPageOpenModalProps {
  movieDetail?: MovieDetailResponse;
}

function DetailPageOpenModal({ movieDetail }: DetailPageOpenModalProps) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieDetail == null || onceRef.current) {
      return;
    }

    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}
