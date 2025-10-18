import { useEffect, useRef } from 'react';

import { moviesApi } from '@/api/movies';
import Home from '@/pages';

import { MovieItem } from '@/types/Movie.types';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';

import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import Head from 'next/head';

export const getServerSideProps = (async (context) => {
  const { movieId } = context.params ?? {};
  if (!movieId || typeof movieId !== 'string') {
    return { notFound: true };
  }

  try {
    const [movies, movieDetail] = await Promise.all([moviesApi.getPopular(), moviesApi.getDetail(Number(movieId))]);

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
      <Head>
        <title>{movieDetail.title}</title>
        <meta
          property="og:title"
          content={movieDetail.title}
        />
        <meta
          property="og:description"
          content={movieDetail.overview}
        />
        <meta
          property="og:image"
          content={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
        />
      </Head>
      <Home movies={movies} />
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

function DetailPageOpenModal({ movieDetail }: { movieDetail: MovieDetailResponse }) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (!movieDetail.id || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(movieDetail);
    })();
  }, [movieDetail, openMovieDetailModal]);

  return null;
}
