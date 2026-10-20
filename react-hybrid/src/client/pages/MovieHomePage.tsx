import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { Loading } from '../components/common/Loading';
import { MovieItem } from '../types/Movie.types';

type Props = {
  movies?: MovieItem[];
};

export default function MovieHomePage({ movies }: Props) {
  if (!movies) {
    return <Loading />;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}
