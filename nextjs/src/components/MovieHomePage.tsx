import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { usePopularMovies } from '../hooks/queries/usePopularMovies';

export default function MovieHomePage() {
  const { data: movies, error } = usePopularMovies();

  return (
    <div id="wrap">
      <Header featuredMovie={movies?.[0]} error={error} />
      <MovieList movies={movies ?? []} error={error} />
      <Footer />
    </div>
  );
}
