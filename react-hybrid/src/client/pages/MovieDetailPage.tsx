import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import MovieHomePage from "./MovieHomePage";
import { MovieItem, MovieResponse } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";

interface MovieDetailPageProps {
  popularMoviesResult: MovieItem[];
  movieDetailResult: MovieDetailResponse;
}
export default function MovieDetailPage({
  popularMoviesResult,
  movieDetailResult,
}: MovieDetailPageProps) {
  if (popularMoviesResult.length === 0 || !movieDetailResult) {
    return <div>영화 데이터가 없습니다.</div>;
  }

  return (
    <>
      <MovieHomePage popularMoviesResult={popularMoviesResult} />
      <DetailPageOpenModal movieDetail={movieDetailResult} />
    </>
  );
}

function DetailPageOpenModal({
  movieDetail,
}: {
  movieDetail: MovieDetailResponse;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (!movieDetail || onceRef.current) {
      return;
    }
    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}
