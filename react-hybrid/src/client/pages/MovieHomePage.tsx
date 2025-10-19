import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { MovieResponse } from "../types/Movie.types";
import { ApiResult } from "../types/ApiResult.types";

interface MovieHomePageProps {
  popularMoviesResult: ApiResult<MovieResponse>;
}

export default function MovieHomePage({
  popularMoviesResult,
}: MovieHomePageProps) {
  const { data: movies, error } = popularMoviesResult;

  if (error) {
    return <div> 꺄악! 고장났슈! {error.message}</div>;
  }

  if (!movies.results || movies.results.length === 0) {
    return <div>영화 데이터가 없습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={movies.results[0]} />
      <MovieList movies={movies.results} />
      <Footer />
    </div>
  );
}
