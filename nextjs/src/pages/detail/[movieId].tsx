import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { moviesApi } from '../../api/movies';
import MovieHomeView from '@/views/MovieHomeView';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { MovieItem } from '@/types/Movie.types';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import Head from 'next/head';

export const getServerSideProps = (async ({ params }) => {
  const movieId = params?.movieId;

  const { data: popular } = await moviesApi.getPopular();
  const { data: detail } = await moviesApi.getDetail(Number(movieId));

  return { props: { movies: popular.results, movie: detail } };
}) satisfies GetServerSideProps<{
  movies: MovieItem[];
  movie: MovieDetailResponse;
}>;

export default function MovieDetailPage({
  movies,
  movie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : 'https://rendering-basecamp-hazel.vercel.app/images/no_image.png';

  return (
    <>
      <Head>
        <title>{movie.title}</title>
        <meta property="og:title" content={movie.title} />
        <meta
          property="og:description"
          content={movie.overview}
          key="description"
        />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <MovieHomeView movies={movies} />
      <DetailPageOpenModal movie={movie} />
    </>
  );
}

function DetailPageOpenModal({ movie }: { movie: MovieDetailResponse }) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(movie);
    })();
  }, [movie.id, openMovieDetailModal]);

  return null;
}
