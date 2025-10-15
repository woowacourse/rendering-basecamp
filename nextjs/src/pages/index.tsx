import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { moviesApi } from '@/api/movies';
import type { MovieItem } from '@/types/Movie.types';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';

interface HomeProps {
  movies: MovieItem[];
}

export default function Home({ movies }: HomeProps) {
  return (
    <>
      <Head>
        <title>인기 영화 | 영화 사이트</title>
        <meta
          name="description"
          content="지금 가장 인기 있는 영화들을 확인해보세요"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="인기 영화 | 영화 사이트" />
        <meta
          property="og:description"
          content="지금 가장 인기 있는 영화들을 확인해보세요"
        />
        <meta
          property="og:image"
          content={
            `https://image.tmdb.org/t/p/original${movies[0].poster_path}` || ''
          }
        />
        <meta
          property="og:url"
          content="https://rendering-basecamp-zl46.vercel.app/"
        />
        <meta property="og:type" content="website" />
      </Head>

      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await moviesApi.getPopular();
    return {
      props: {
        movies: response.data.results,
      },
    };
  } catch (error) {
    console.error('Failed to fetch popular movies:', error);
    return {
      props: {
        movies: [],
      },
    };
  }
};
