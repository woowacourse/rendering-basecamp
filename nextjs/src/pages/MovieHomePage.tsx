import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { MovieItem } from "@/types/Movie.types";

type Props = {
  initialMovies?: MovieItem[];
};

export default function MovieHomePage({ initialMovies }: Props) {
  if (!initialMovies || initialMovies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={initialMovies[0]} />
      <MovieList movies={initialMovies} />
      <Footer />
    </div>
  );
}
