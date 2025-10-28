import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { moviesApi } from "../api/movies";

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    if (movieId == null) return;

    if (
      typeof window !== "undefined" &&
      window.__INITIAL_DATA__ &&
      window.__INITIAL_DATA__.movieDetail
    ) {
      const initialData = window.__INITIAL_DATA__.movieDetail;
      window.__INITIAL_DATA__.movieDetail = undefined;
      openMovieDetailModal(initialData);
      return;
    }

    (async () => {
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, openMovieDetailModal]);

  return null;
}
