import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { MovieItem } from '@/types/Movie.types';

interface Props {
  movies: MovieItem[];
}

export default function MovieHomeView({ movies }: Props) {
  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}
