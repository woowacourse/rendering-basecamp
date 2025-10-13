import { useEffect, useRef } from "react";
import Home from "..";
import { useParams } from "next/navigation";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { moviesApi } from "@/api/movies";
import { useRouter } from "next/router";

export default function MovieDetailPage() {
  return (
    <>
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const router = useRouter();
  const { id } = router.query;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (id == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(id));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [id, openMovieDetailModal]);

  return <Home />;
}
