import { moviesApi } from '@/api/movies';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { useParams } from 'next/navigation';
import { useRef, useEffect } from 'react';
import MovieHomePage from '..';

export default function MovieDetailPage() {
  return (
    <>
      <MovieHomePage />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const { movieId } = useParams();
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
