import { useMovieDetailModal } from "../../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Home from "../index";
import { moviesApi } from "../../api/movies";

export default function MovieDetailPage() {
  return (
    <>
      <Home />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const router = useRouter();
  const { movieId } = router.query;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, openMovieDetailModal]);

  return null;
}
