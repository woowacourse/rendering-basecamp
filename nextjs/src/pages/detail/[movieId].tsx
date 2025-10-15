import { useEffect, useRef } from 'react';

import { moviesApi } from '@/api/movies';
import Home from '@/pages';

import { MovieItem } from '@/types/Movie.types';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';

import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import Head from 'next/head';

export const getServerSideProps = (async (context) => {
  const { movieId } = context.query;
  if (!movieId || typeof movieId !== 'string') {
    return { notFound: true };
  }

  try {
    const movies = await moviesApi.getPopular();
    const movieDetail = await moviesApi.getDetail(Number(movieId));

    return {
      props: { movies: movies.data.results, movieDetail: movieDetail.data },
    };
  } catch (error) {
    return { notFound: true };
  }
}) satisfies GetServerSideProps<{
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}>;

export default function MovieDetailPage({
  movies,
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Home movies={movies} />
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

function DetailPageOpenModal({ movieDetail }: { movieDetail: MovieDetailResponse }) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(movieDetail);
    })();
  }, [openMovieDetailModal]);

  return null;
}
