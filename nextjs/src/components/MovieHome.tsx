import { Header } from "./Header";
import { MovieList } from "./MovieList";
import { Footer } from "./Footer";
import type { MovieItem } from "../types/Movie.types";

interface MovieHomeProps {
  movies: MovieItem[];
  preloadBackground?: boolean;
}

export const MovieHome = ({
  movies,
  preloadBackground = false,
}: MovieHomeProps) => {
  if (movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header
        featuredMovie={movies[0]}
        preloadBackground={preloadBackground}
      />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
};
