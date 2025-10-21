import { useEffect, useRef } from "react";
import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import MovieHomePage from "./MovieHomePage";

interface MovieDetailPageProps {
  initialMovies: MovieItem[];
  selectedMovieDetail: MovieDetailResponse;
}

const MovieDetailPage = ({
  initialMovies,
  selectedMovieDetail,
}: MovieDetailPageProps) => {
  return (
    <>
      <MovieHomePage initialMovies={initialMovies} />
      <DetailPageOpenModal selectedMovieDetail={selectedMovieDetail} />
    </>
  );
};

export default MovieDetailPage;

interface DetailPageOpenModalProps {
  selectedMovieDetail: MovieDetailResponse;
}

const DetailPageOpenModal = ({
  selectedMovieDetail,
}: DetailPageOpenModalProps) => {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) return;
    onceRef.current = true;

    openMovieDetailModal(selectedMovieDetail);
  }, [selectedMovieDetail, openMovieDetailModal]);

  return null;
};
