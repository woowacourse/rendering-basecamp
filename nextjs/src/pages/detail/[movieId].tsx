import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import MovieHomePage, { getServerSideProps } from '../index';
import { moviesApi } from '../../api/movies';
import type { MovieItem } from '../../types/Movie.types';

export { getServerSideProps };

export default function MovieDetailPage({ movies }: { movies: MovieItem[] }) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const router = useRouter();
  const { movieId } = router.query;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (typeof movieId !== 'string' || onceRef.current === true) {
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
