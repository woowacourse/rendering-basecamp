import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import Head from 'next/head';
import { moviesApi } from '../api/movies';
import type { MovieItem } from '../types/Movie.types';

export const getServerSideProps = (async () => {
  try {
    const movieResponse = await moviesApi.getPopular();
    const movies = movieResponse.data.results;

    return {
      props: {
        movies,
      },
    };
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return {
      props: {
        movies: [],
      },
    };
  }
}) satisfies GetServerSideProps<{ movies: MovieItem[] }>;

export default function MovieHomePage({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>영화 추천 사이트</title>
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
