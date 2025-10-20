import Head from 'next/head';
import { MovieItem } from '../types/Movie.types';
import { moviesApi } from '@/api/movies';
import { GetServerSideProps } from 'next';
import { MovieLayout } from '@/components/MovieLayout';

interface HomeProps {
  movies: MovieItem[];
}

export default function Home({ movies }: HomeProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>Movie Review App</title>
        <meta name="description" content="영화 리뷰 앱" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Movie Review App" />
        <meta property="og:description" content="인기 영화 목록을 확인하고 리뷰를 남겨보세요" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MovieLayout movies={movies} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const response = await moviesApi.getPopular();

    return {
      props: {
        movies: response.data.results,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        movies: [],
      },
    };
  }
};
