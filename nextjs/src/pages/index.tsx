import { GetServerSideProps } from 'next';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { Footer } from '@/components/Footer';
import { usePopularMovies } from '@/hooks/queries/usePopularMovies';
import { Loading } from '@/components/common/Loading';
import { moviesApi } from '@/api/movies';
import type { MovieItem } from '@/types/Movie.types';

interface HomeProps {
  initialMovies: MovieItem[];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const movieDetail = await moviesApi.getPopular();
    return {
      props: {
        initialMovies: movieDetail.data.results,
      },
    };
  } catch (error) {
    console.error('Failed to fetch initial movies:', error);
    return {
      props: {
        initialMovies: [],
      },
    };
  }
};

export default function MovieHomePage({ initialMovies }: HomeProps) {
  const { data: movies, isLoading } = usePopularMovies(initialMovies);

  if (isLoading === true && !initialMovies.length) {
    return <Loading />;
  }

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}
