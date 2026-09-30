import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { moviesApi } from '../../api/movies';
import MovieHomeView from '@/views/MovieHomeView';
import { useRouter } from 'next/router';

export default function MovieDetailPage() {
  return (
    <>
      <div id="wrap">
        <MovieHomeView />
      </div>
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const router = useRouter();

  if (!router.isReady) return null;

  const movieId = router.query.movieId;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, openMovieDetailModal]);

  return null;
}
