import { Header } from './Header';
import { MovieList } from './MovieList';
import { Footer } from './Footer';
import { usePopularMovies } from '../hooks/queries/usePopularMovies';
import { Loading } from './common/Loading';

export const MovieHome = () => {
  const { data: movies, isLoading } = usePopularMovies();

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
};
