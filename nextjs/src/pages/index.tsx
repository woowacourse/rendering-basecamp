import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { MovieHome } from '../components/MovieHome';
import { moviesApi } from '../api/movies';
import type { MovieItem } from '../types/Movie.types';

interface HomePageProps {
  movies: MovieItem[];
}

export default function Home({ movies }: HomePageProps) {
  return (
    <>
      <Head>
        <title>MovieList</title>
        <meta name="description" content="지금 인기 있는 영화를 확인해보세요." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MovieHome movies={movies} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    const response = await moviesApi.getPopular();

    return {
      props: {
        movies: response.data.results,
      },
    };
  } catch {
    return {
      props: {
        movies: [],
      },
    };
  }
};
