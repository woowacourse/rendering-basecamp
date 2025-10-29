import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { MovieItem } from '../types/Movie.types';

export default function MovieHomePage({
  initialData,
}: {
  initialData: { movies: MovieItem[] };
}) {
  if (initialData.movies == null || initialData.movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={initialData.movies[0]} />
      <MovieList movies={initialData.movies} />
      <Footer />
    </div>
  );
}
