import { Loading } from "../components/common/Loading";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { usePopularMovies } from "../hooks/queries/usePopularMovies";
import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";

interface MovieHomePageProps {
  initialMovies?: {
    movies: MovieItem[];
    details?: MovieDetailResponse | null;
  };
}

export default function MovieHomePage({ initialMovies }: MovieHomePageProps) {
  const { data: movies, isLoading } = usePopularMovies({
    initialMovies: initialMovies?.movies,
  });

  if (isLoading === true) {
    return <Loading />;
  }

  if (movies == null || movies.length === 0) {
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
