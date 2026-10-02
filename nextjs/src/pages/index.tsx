import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { MovieHome } from '../components/MovieHome';
import { moviesApi } from '../api/movies';
import type { MovieItem } from '../types/Movie.types';

interface HomePageProps {
  movies: MovieItem[];
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    const response = await moviesApi.getPopular();
    return { props: { movies: response.data.results } };
  } catch {
    return { props: { movies: [] } };
  }
};

export default function HomePage({ movies }: HomePageProps) {
  return (
    <>
      <Head>
        <title>영화 리뷰</title>
      </Head>
      <MovieHome movies={movies} />
    </>
  );
}
