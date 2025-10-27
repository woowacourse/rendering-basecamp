import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MovieHomePage from "./MovieHomePage";
import { moviesApi } from "../api/movies";
import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";

export default function MovieDetailPage({
  movies,
  initialDetail,
}: {
  movies: MovieItem[];
  initialDetail?: MovieDetailResponse;
}) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal initialDetail={initialDetail} />
    </>
  );
}

function DetailPageOpenModal({
  initialDetail,
}: {
  initialDetail?: MovieDetailResponse;
}) {
  const { movieId } = useParams();
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current === true) {
      return;
    }

    if (initialDetail) {
      onceRef.current = true;
      openMovieDetailModal(initialDetail);
      return;
    }

    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, openMovieDetailModal, initialDetail]);

  return null;
}
