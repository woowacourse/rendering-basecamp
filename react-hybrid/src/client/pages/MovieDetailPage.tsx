import { useEffect, useRef } from "react";
import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import MovieHomePage from "./MovieHomePage";

interface MovieDetailPageProps {
  initialMovies: MovieItem[];
  selectedMovieDetail: MovieDetailResponse;
}

export default function MovieDetailPage({
  initialMovies,
  selectedMovieDetail,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage initialMovies={initialMovies} />
      <DetailPageOpenModal selectedMovieDetail={selectedMovieDetail} />
    </>
  );
}

interface DetailPageOpenModalProps {
  selectedMovieDetail: MovieDetailResponse;
}

function DetailPageOpenModal({
  selectedMovieDetail,
}: DetailPageOpenModalProps) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) return;
    onceRef.current = true;

    openMovieDetailModal(selectedMovieDetail);
  }, [selectedMovieDetail, openMovieDetailModal]);

  return null;
}
