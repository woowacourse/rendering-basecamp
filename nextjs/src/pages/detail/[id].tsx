import Home from '../index';
import {useEffect, useRef} from "react";
import {moviesApi} from "@/api/movies";
import {useMovieDetailModal} from "@/hooks/useMovieDetailModal";
import {useRouter} from "next/router";

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
  const {movieId} = router.query;
  const {openMovieDetailModal} = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current) {
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
