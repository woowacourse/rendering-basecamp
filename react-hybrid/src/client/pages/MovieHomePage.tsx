import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { usePopularMovies } from '../hooks/queries/usePopularMovies';
import { Loading } from '../components/common/Loading';
import { MovieItem } from '../types/Movie.types';

interface MovieHomePageProps {
  initialPopularMovieList: MovieItem[] | null;
}

export default function MovieHomePage({
  initialPopularMovieList,
}: MovieHomePageProps) {
  const { data: movies, isLoading } = usePopularMovies(initialPopularMovieList);

  if (isLoading === true) {
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
