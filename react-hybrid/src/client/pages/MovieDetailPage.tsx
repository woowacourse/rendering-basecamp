import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import MovieHomePage from "./MovieHomePage";
import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";

interface MovieDetailPageProps {
  movies?: MovieItem[];
  movieDetail?: MovieDetailResponse;
  movieId: number;
}

export default function MovieDetailPage({
  movies,
  movieDetail,
  movieId,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage initialMovies={movies} />
      <DetailPageOpenModal movieDetail={movieDetail} movieId={movieId} />
    </>
  );
}

function DetailPageOpenModal({
  movieDetail,
  movieId,
}: {
  movieDetail: MovieDetailResponse;
  movieId: number;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current === true) {
      return;
    }

    onceRef.current = true;

    if (movieDetail) {
      openMovieDetailModal(movieDetail);
    }
  }, [movieDetail, movieId, openMovieDetailModal]);

  return null;
}
