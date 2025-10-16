import type { GetServerSideProps } from 'next';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { OGHead } from '@/components/OGHead';

import { moviesApi } from '@/api/movies';
import { HOME_URL, TMDB_IMAGE_URL, TMDB_NO_IMAGE_URL } from '@/constants/url';

import type { MovieItem } from '@/types/Movie.types';

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
  } catch {
    return { notFound: true };
  }
};

export default function Home({ movies }: HomeProps) {
  const mostPopularMovie = movies[0];
  const imageUrl = mostPopularMovie.poster_path
    ? `${TMDB_IMAGE_URL}w500${mostPopularMovie.poster_path}`
    : TMDB_NO_IMAGE_URL;

  return (
    <>
      <OGHead
        title="최신 영화리뷰 "
        description="최신 인기 영화를 확인해보세요."
        imageUrl={imageUrl}
        url={HOME_URL}
        width={500}
        height={750}
        alt="인기 영화 리뷰"
      />

      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
