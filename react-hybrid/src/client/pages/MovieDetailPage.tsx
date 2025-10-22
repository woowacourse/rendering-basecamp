import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MovieHomePage from "./MovieHomePage";
import { moviesApi } from "../api/movies";
import { MovieDetailResponse } from "../types/MovieDetail.types";

interface MovieDetailPageProps {
  initialMovieDetail?: MovieDetailResponse;
}

export default function MovieDetailPage({
  initialMovieDetail,
}: MovieDetailPageProps) {
  return (
    <>
      <DetailPageOpenModal initialMovieDetail={initialMovieDetail} />
    </>
  );
}

function DetailPageOpenModal({
  initialMovieDetail,
}: {
  initialMovieDetail?: MovieDetailResponse;
}) {
  const { movieId } = useParams();
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (initialMovieDetail && !onceRef.current) {
      onceRef.current = true;
      openMovieDetailModal(initialMovieDetail);
      return;
    }

    if (movieId == null || onceRef.current === true) {
      return;
    }

    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, initialMovieDetail, openMovieDetailModal]);

  return null;
}
