import Head from 'next/head';

import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { Footer } from '@/components/Footer';
import { moviesApi } from '@/api/movies';
import type { MovieItem } from '@/types/Movie.types';

export const getServerSideProps: GetServerSideProps<{
  movies: MovieItem[];
}> = async () => {
  try {
    const response = await moviesApi.getPopular(1);

    return {
      props: {
        movies: response.data.results,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default function MovieHomePage({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>기린의 영화 리뷰 사이트</title>
        <meta name='description' content='영화 목록' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div id='wrap'>
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
