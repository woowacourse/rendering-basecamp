import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import MovieHomePage from './MovieHomePage';
import { moviesApi } from '../api/movies';

export default function MovieDetailPage() {
  return (
    <>
      <MovieHomePage />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const match = pathname.match(/\/detail\/(\d+)/);
    const movieId = match ? match[1] : null;

    if (movieId == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;

      const initialMovieDetail = typeof window !== 'undefined'
        ? window.__INITIAL_DATA__?.movieDetail
        : null;

      let movieDetail;
      if (initialMovieDetail && initialMovieDetail.id === Number(movieId)) {
        movieDetail = initialMovieDetail;
      } else {
        const response = await moviesApi.getDetail(Number(movieId));
        movieDetail = response.data;
      }

      openMovieDetailModal(movieDetail);
    })();
  }, [openMovieDetailModal]);

  return null;
}
