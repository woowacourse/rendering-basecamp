import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { moviesApi } from '../../api/movies';
import { MovieDetailModal } from '../../components/MovieDetailModal';
import MovieHomePage from '../index';

export const getServerSideProps = (async ({ params }) => {
  const movieId = Number(params?.movieId);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    return { notFound: true };
  }

  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);

  return {
    props: {
      movies: popularResponse.data.results,
      movie: detailResponse.data,
    },
  };
}) satisfies GetServerSideProps;

export default function MovieDetailPage({
  movies,
  movie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <>
      <MovieHomePage movies={movies} />
      <Head>
        <title>{movie.title} - 영화 리뷰</title>
        <meta property="og:title" content={movie.title} key="og:title" />
        <meta
          property="og:description"
          content={movie.overview || '영화 상세 정보'}
          key="og:description"
        />
        {movie.poster_path && (
          <meta
            property="og:image"
            content={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
            key="og:image"
          />
        )}
      </Head>
      <MovieDetailModal movie={movie} onClose={() => void router.replace('/')} />
    </>
  );
}
