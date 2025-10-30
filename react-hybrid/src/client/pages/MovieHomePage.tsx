import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import type { MovieItem } from '../types/Movie.types';

export default function MovieHomePage({ movies }: { movies: MovieItem[] }) {
  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}
