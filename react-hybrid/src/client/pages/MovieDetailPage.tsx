import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import MovieHomePage from "./MovieHomePage";
import { moviesApi } from "../api/movies";

export default function MovieDetailPage() {
  return (
    <>
      <MovieHomePage />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    const movieId = window.__INITIAL_DATA__?.movieId;

    if (movieId == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [openMovieDetailModal]);

  return null;
}
