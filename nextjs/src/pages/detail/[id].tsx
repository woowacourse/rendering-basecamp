import { moviesApi } from '@/api/movies';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { useRouter } from 'next/router';
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
  const { query } = useRouter();
  const id = query?.id;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (id == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(id));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [id, openMovieDetailModal]);

  return null;
}
