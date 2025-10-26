import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import MovieHomePage from './MovieHomePage';
import { moviesApi } from '../api/movies';
import type { MovieDetailResponse } from '../types/MovieDetail.types';
import type { MovieItem } from '../types/Movie.types';

interface MovieDetailPageProps {
  initialMovies?: MovieItem[];
  initialMovieDetail?: MovieDetailResponse;
}

export default function MovieDetailPage({
  initialMovies,
  initialMovieDetail,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage initialMovies={initialMovies} />
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
    if (movieId == null || onceRef.current === true) {
      return;
    }

    const id = Number(movieId);
    onceRef.current = true;

    // 1. SSR 초기 데이터가 현재 라우트 id와 일치하면 즉시 사용
    if (initialMovieDetail?.id === id) {
      openMovieDetailModal(initialMovieDetail);
      return;
    }

    // 2. 없으면 서버에서 조회
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, initialMovieDetail, openMovieDetailModal]);

  return null;
}
