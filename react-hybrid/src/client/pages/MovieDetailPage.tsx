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
  const lastMovieIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (movieId == null) {
      return;
    }

    // movieId가 바뀌었을 때만 모달 열기
    if (lastMovieIdRef.current === movieId) {
      return;
    }

    lastMovieIdRef.current = movieId;

    if (initialDetail) {
      openMovieDetailModal(initialDetail);
      return;
    }

    (async () => {
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, openMovieDetailModal, initialDetail]);

  return null;
}
