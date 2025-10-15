import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { moviesApi } from '../api/movies';
import { MovieItem } from '../types/Movie.types';

interface HomeProps {
  movies: MovieItem[];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const movies = await moviesApi.getPopular();

    return {
      props: {
        movies: movies.data.results,
      },
    };
  } catch (error) {
    console.error('영화 정보를 불러오는데 실패했습니다:', error);
    return {
      notFound: true,
    };
  }
};

export default function Home({ movies }: HomeProps) {
  return (
    <>
      <Head>
        <title>Movielist</title>
        <meta name="description" content="영화 리뷰" />
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
