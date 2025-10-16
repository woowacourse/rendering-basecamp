import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { Footer } from '@/components/Footer';
import type { MovieItem } from '@/types/Movie.types';

interface HomeViewProps {
  movies: MovieItem[];
}

export const HomeView = ({ movies }: HomeViewProps) => {
  if (!movies || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
};
