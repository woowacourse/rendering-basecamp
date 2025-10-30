import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import MovieHomePage from "./MovieHomePage";

import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";

interface MovieDetailPageProps {
  initialMovies?: {
    movies: MovieItem[];
    details?: MovieDetailResponse | null;
  };
}

export default function MovieDetailPage({
  initialMovies,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage initialMovies={initialMovies} />
      <DetailPageOpenModal movieDetail={initialMovies.details} />
    </>
  );
}

function DetailPageOpenModal({
  movieDetail,
}: {
  movieDetail: MovieDetailResponse;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieDetail.id == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(movieDetail);
    })();
  }, [movieDetail.id, openMovieDetailModal]);

  return null;
}
