import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { MovieItem } from "../types/Movie.types";

type Props = {
  movies?: MovieItem[];
};

export default function MovieHomePage({ movies }: Props) {
  if (!movies) {
    return <div>영화 정보를 불러오는 중입니다...</div>;
  }
  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}
