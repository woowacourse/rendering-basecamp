import type { GetServerSideProps } from 'next';
import Head from 'next/head';

import { moviesApi } from '../api/movies';
import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import type { MovieItem } from '../types/Movie.types';

type HomeProps = {
  movies: MovieItem[];
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await moviesApi.getPopular();

  return {
    props: {
      movies: response.data.results,
    },
  };
};

export default function Home({ movies }: HomeProps) {
  if (movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>영화 리뷰</title>
      </Head>

      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
