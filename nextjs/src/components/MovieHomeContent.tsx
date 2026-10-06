import type { MovieItem } from "../types/Movie.types";
import { Header } from "./Header";
import { MovieList } from "./MovieList";
import { Footer } from "./Footer";

export function MovieHomeContent({ movies }: { movies: MovieItem[] }) {
  return (
    <div id="wrap">
      {movies.length > 0 && <Header featuredMovie={movies[0]} />}
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}
