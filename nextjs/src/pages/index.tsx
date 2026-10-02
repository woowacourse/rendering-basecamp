import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { moviesApi } from '../api/movies';
import { MovieHome } from '../components/MovieHome';
import { SITE_NAME } from '../constants/site';
import type { MovieItem } from '../types/Movie.types';

const DESCRIPTION = '지금 인기 있는 영화를 확인하고 별점을 남겨 보세요.';

interface Props {
  movies: MovieItem[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const { data } = await moviesApi.getPopular();
    return { props: { movies: data.results } };
  } catch {
    return { props: { movies: [] } };
  }
};

export default function MovieHomePage({ movies }: Props) {
  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={SITE_NAME} />
        <meta property="og:description" content={DESCRIPTION} />
      </Head>
      <MovieHome movies={movies} />
    </>
  );
}
