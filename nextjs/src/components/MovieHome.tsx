import { Header } from './Header';
import { MovieList } from './MovieList';
import { Footer } from './Footer';
import type { MovieItem } from '../types/Movie.types';

/**
 * 홈 화면 본문. 상세 페이지에서도 배경으로 재사용하므로 head 태그는 포함하지 않는다.
 */
export const MovieHome = ({ movies }: { movies: MovieItem[] }) => {
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
