import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import type { MovieItem } from "../types/Movie.types";

interface MovieHomePageProps {
  popularMoviesResult: MovieItem[];
}

export default function MovieHomePage({
  popularMoviesResult,
}: MovieHomePageProps) {
  if (popularMoviesResult.length === 0) {
    return <div>영화 데이터가 없습니다.</div>;
  }
  const featuredMovie = popularMoviesResult[0];
  return (
    <div id="wrap">
      <Header featuredMovie={featuredMovie} />
      <MovieList movies={popularMoviesResult} />
      <Footer />
    </div>
  );
}
