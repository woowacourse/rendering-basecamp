import { moviesApi } from '@/api/movies';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { MovieItem } from '@/types/Movie.types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

export default function Home({ movies }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>SSR로 버무린 영화 리뷰</title>
        <meta name="description" content="최신 영화 목록을 확인해보세요!" />
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

export const getServerSideProps: GetServerSideProps<{ movies: MovieItem[] }> = async () => {
  const popularResponse = await moviesApi.getPopular();

  return {
    props: {
      movies: popularResponse.data.results,
    },
  };
};
