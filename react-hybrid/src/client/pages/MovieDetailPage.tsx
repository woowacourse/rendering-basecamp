import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import MovieHomePage from "./MovieHomePage";
import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";

interface MovieDetailPageProps {
  movies: MovieItem[];
  detail?: MovieDetailResponse;
}

export default function MovieDetailPage({
  movies,
  detail,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal movieItem={detail} />
    </>
  );
}

function DetailPageOpenModal({
  movieItem,
}: {
  movieItem: MovieDetailResponse;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current === true) {
      return;
    }

    (async () => {
      onceRef.current = true;
      openMovieDetailModal(movieItem);
    })();
  }, [openMovieDetailModal]);

  return null;
}
