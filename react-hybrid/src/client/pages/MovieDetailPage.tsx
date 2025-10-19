import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import MovieHomePage from "./MovieHomePage";
import { MovieResponse } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { ApiResult } from "../types/ApiResult.types";

interface MovieDetailPageProps {
  popularMoviesResult: ApiResult<MovieResponse>;
  movieDetailResult: ApiResult<MovieDetailResponse>;
}
export default function MovieDetailPage({
  popularMoviesResult,
  movieDetailResult,
}: MovieDetailPageProps) {
  const { data: movies, error: popularMoviesError } = popularMoviesResult;
  const { data: movieDetail, error: movieDetailError } = movieDetailResult;

  if (popularMoviesError) {
    return <div> 꺄악! 고장났슈! {popularMoviesError.message}</div>;
  }

  if (movieDetailError) {
    return <div> 꺄악! 고장났슈! {movieDetailError.message}</div>;
  }

  if (!movies || !movies.results || movies.results.length === 0) {
    return <div>영화 데이터가 없습니다.</div>;
  }

  if (!movieDetail) {
    return <div>영화 상세 정보가 없습니다.</div>;
  }

  return (
    <>
      <MovieHomePage popularMoviesResult={popularMoviesResult} />
      <DetailPageOpenModal movieDetail={movieDetail} />
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
