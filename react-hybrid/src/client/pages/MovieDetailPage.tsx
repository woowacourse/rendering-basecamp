import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import MovieHomePage from './MovieHomePage';
import { moviesApi } from '../api/movies';
import { MovieItem } from '../types/Movie.types';
import { MovieDetailResponse } from '../types/MovieDetail.types';

interface MovieDetailPageProps {
  initialMovies?: MovieItem[];
  initialMovieDetail?: MovieDetailResponse;
}

export default function MovieDetailPage({ initialMovies, initialMovieDetail }: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage initialMovies={initialMovies} />
      <DetailPageOpenModal initialMovieDetail={initialMovieDetail} />
    </>
  );
}

interface DetailPageOpenModalProps {
  initialMovieDetail?: MovieDetailResponse;
}

function DetailPageOpenModal({ initialMovieDetail }: DetailPageOpenModalProps) {
  const movieId = typeof window !== 'undefined' ? window.location.pathname.split('/detail/')[1] : null;

  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current === true) {
      return;
    }

    (async () => {
      onceRef.current = true;

      if (initialMovieDetail) {
        openMovieDetailModal(initialMovieDetail);
      } else {
        const movieDetail = await moviesApi.getDetail(Number(movieId));
        openMovieDetailModal(movieDetail.data);
      }
    })();
  }, [movieId, openMovieDetailModal, initialMovieDetail]);

  return null;
}
