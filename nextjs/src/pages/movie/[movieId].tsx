import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { moviesApi } from '../../api/movies';
import MovieHomeView from '@/views/MovieHomeView';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { MovieItem } from '@/types/Movie.types';
import { useParams } from 'next/navigation';

export const getServerSideProps = (async () => {
  const { data } = await moviesApi.getPopular();

  return { props: { movies: data.results } };
}) satisfies GetServerSideProps<{ movies: MovieItem[] }>;

export default function MovieDetailPage({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <MovieHomeView movies={movies} />
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
