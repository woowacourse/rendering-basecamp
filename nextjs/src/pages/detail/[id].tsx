import { moviesApi } from "@/api/movies";
import MovieHomePage from "@/components/MovieHomePage";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function MovieDetailPage() {
  return (
    <>
      <MovieHomePage />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const router = useRouter();
  const movieId = router.query.id;
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
