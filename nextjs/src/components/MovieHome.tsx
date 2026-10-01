import { MovieList } from "@/components/MovieList";
import { Footer } from "@/components/Footer";
import { MovieItem } from "@/types/Movie.types";
import { Header } from "./Header";

export interface MovieHomeProps {
  movies: MovieItem[];
}

export default function MovieHome({ movies }: MovieHomeProps) {
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
