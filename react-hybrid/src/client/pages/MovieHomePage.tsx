import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { MovieResponse } from "../types/Movie.types";

export default function MovieHomePage({
  movieData,
}: {
  movieData: MovieResponse;
}) {
  const movies = movieData.results;
  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}
