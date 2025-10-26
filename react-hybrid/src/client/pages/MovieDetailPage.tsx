import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import MovieHomePage from "./MovieHomePage";
import { moviesApi } from "../api/movies";
import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";

interface MovieDetailPageProps {
  movies?: MovieItem[];
  detailMovie?: MovieDetailResponse;
}

export default function MovieDetailPage({
  movies,
  detailMovie,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal detailMovie={detailMovie} />
    </>
  );
}

function DetailPageOpenModal({
  detailMovie,
}: {
  detailMovie?: MovieDetailResponse;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    const movieId = window.__INITIAL_DATA__?.movieId;

    if (movieId == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail =
        detailMovie || (await moviesApi.getDetail(Number(movieId))).data;
      openMovieDetailModal(movieDetail);
    })();
  }, [openMovieDetailModal, detailMovie]);

  return null;
}
