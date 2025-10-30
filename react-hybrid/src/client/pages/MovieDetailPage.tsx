import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import MovieHomePage from './MovieHomePage';
import type { MovieItem } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';

interface MovieDetailPageProps {
  movies?: MovieItem[];
  movieId?: number;
  movieDetail?: MovieDetailResponse;
}

export default function MovieDetailPage({
  movies,
  movieId,
  movieDetail,
}: MovieDetailPageProps) {
  // 서버사이드 렌더링에서는 props를 사용, 클라이언트에서는 window.__INITIAL_DATA__ 사용
  const initialData =
    typeof window !== 'undefined' ? window.__INITIAL_DATA__ : null;
  const finalMovies = movies || initialData?.movies || [];
  const finalMovieId = movieId || initialData?.movieId;
  const finalMovieDetail = movieDetail || initialData?.movieDetail;

  return (
    <>
      <MovieHomePage movies={finalMovies} />
      <DetailPageOpenModal
        movieId={finalMovieId}
        movieDetail={finalMovieDetail}
      />
    </>
  );
}

interface DetailPageOpenModalProps {
  movieId?: number;
  movieDetail?: MovieDetailResponse;
}

function DetailPageOpenModal({
  movieId,
  movieDetail,
}: DetailPageOpenModalProps) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current === true) {
      return;
    }

    onceRef.current = true;

    // 서버에서 이미 가져온 데이터가 있으면 바로 모달 열기
    if (movieDetail) {
      openMovieDetailModal(movieDetail);
    }
  }, [movieId, movieDetail, openMovieDetailModal]);

  return null;
}
