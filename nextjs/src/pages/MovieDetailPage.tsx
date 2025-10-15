import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { moviesApi } from "../api/movies";
import MovieHomePage from "./MovieHomePage";

export default function MovieDetailPage() {
  return (
    <>
      <MovieHomePage />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const { query } = useRouter();
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (query.movieId == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(query.movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [query.movieId, openMovieDetailModal]);

  return null;
}
