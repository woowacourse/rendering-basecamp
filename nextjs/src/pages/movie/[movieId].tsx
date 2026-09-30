import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { moviesApi } from '../../api/movies';
import MovieHomeView from '@/views/MovieHomeView';
import { useRouter } from 'next/router';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { MovieItem } from '@/types/Movie.types';

export const getServerSideProps = (async () => {
  const { data } = await moviesApi.getPopular();

  return { props: { movies: data.results } };
}) satisfies GetServerSideProps<{ movies: MovieItem[] }>;

export default function MovieDetailPage({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div id="wrap">
        <MovieHomeView movies={movies} />
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
