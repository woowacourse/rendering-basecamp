import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { MovieItem } from "../types/Movie.types";

interface MovieHomePageProps {
  initialMovies?: MovieItem[];
}

export default function MovieHomePage({ initialMovies }: MovieHomePageProps) {
  return (
    <div id="wrap">
      <Header featuredMovie={initialMovies?.[0]} />
      <MovieList movies={initialMovies} />
      <Footer />
    </div>
  );
}
