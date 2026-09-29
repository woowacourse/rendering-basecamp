import { MovieItem } from "@/types/Movie.types";
import { Header } from "../Header";
import { MovieList } from "../MovieList";
import { Footer } from "../Footer";

const MovieHomeContent = ({ movies }: { movies: MovieItem[] }) => {
  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
};

export default MovieHomeContent;
