import { moviesApi } from "@/api/movies";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import HomePage from "../../index";

export default function DetailPage() {
  return (
    <>
      <HomePage />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const { query, isReady } = useRouter();
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (!isReady || onceRef.current === true) {
      return;
    }

    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(query.movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [query, openMovieDetailModal]);

  return null;
}
