import type { MovieResponse } from "../types/Movie.types";

import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";

type MovieHomeProps = {
  movieResponse: MovieResponse;
};

export function MovieHome({ movieResponse }: MovieHomeProps) {
  const movies = movieResponse?.results ?? [];

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
}
