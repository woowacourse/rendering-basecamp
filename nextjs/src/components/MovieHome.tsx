import { Footer } from './Footer';
import { Header } from './Header';
import { MovieList } from './MovieList';
import type { MovieItem } from '../types/Movie.types';

interface MovieHomeProps {
  movies: MovieItem[];
}

export const MovieHome = ({ movies }: MovieHomeProps) => {
  if (movies.length === 0) {
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
