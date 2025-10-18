import { moviesApi } from '@/api/movies';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import Head from 'next/head';

import { MovieItem } from '@/types/Movie.types';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';

export const getServerSideProps = (async () => {
  try {
    const popularMovies = await moviesApi.getPopular();
    return { props: { movies: popularMovies.data.results } };
  } catch (error) {
    return { notFound: true };
  }
}) satisfies GetServerSideProps<{
  movies: MovieItem[] | null;
}>;

export default function Home({ movies }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>로건의 영화 리뷰</title>
        <meta
          name="description"
          content="영화 리뷰 사이트입니다."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
