import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Footer } from '@/components/Footer';
import { MovieList } from '@/components/MovieList';
import { moviesApi } from '../api/movies';
import type { MovieItem } from '@/types/Movie.types';
import { Header } from '@/components/Header';

interface HomeMoviesProps {
  movies: MovieItem[];
}

export default function Home({ movies }: HomeMoviesProps) {
  if (!movies || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const movieImage = movies[0].poster_path
    ? `https://image.tmdb.org/t/p/w500${movies[0].poster_path}`
    : '/images/dizzy_planet.png';

  return (
    <>
      <Head>
        <title>Movielist</title>
        <meta
          name="description"
          content="영화 정보를 확인할 수 있습니다. 여러 최신 영화의 정보를 평점과 함께 확인해보세요"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="movieList" />
        <meta property="og:title" content={movies[0].title} />
        <meta property="og:description" content={movies[0].overview} />
        <meta property="og:image" content={movieImage} />

        <meta property="twitter:image" content={movieImage} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Movielist" />
        <meta
          property="twitter:description"
          content="영화 정보를 확인할 수 있습니다. 여러 최신 영화의 정보를 평점과 함께 확인해보세요"
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

export const getServerSideProps: GetServerSideProps<
  HomeMoviesProps
> = async () => {
  try {
    const response = await moviesApi.getPopular();
    return {
      props: {
        movies: response.data.results,
      },
    };
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return {
      props: {
        movies: [],
      },
    };
  }
};
