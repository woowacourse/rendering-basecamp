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
