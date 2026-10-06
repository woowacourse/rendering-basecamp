import { Footer } from './Footer';
import { Header } from './Header';
import { MovieList } from './MovieList';

import type { MovieItem as MovieItemType } from '../types/Movie.types';

export const MovieHome = ({ movies }: { movies: MovieItemType[] }) => {
  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
};
