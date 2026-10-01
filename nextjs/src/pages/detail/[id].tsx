import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import MovieHomePage from '../index';
import { moviesApi } from '../../api/movies';

export default function MovieDetailPage() {
  return (
    <>
      <MovieHomePage />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const router = useRouter();
  const movieId = router.query.id;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (!router.isReady || movieId == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [router.isReady, movieId, openMovieDetailModal]);

  return null;
}
