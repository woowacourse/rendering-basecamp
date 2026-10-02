import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { moviesApi } from '../api/movies';
import type { MovieItem } from '../types/Movie.types';

interface HomePageProps {
  movies: MovieItem[];
}

export default function Home({ movies }: HomePageProps) {
  if (movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>MovieList</title>
        <meta name="description" content="지금 인기 있는 영화를 확인해보세요." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
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
