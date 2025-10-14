import { Header } from "./Header";
import { MovieList } from "./MovieList";
import { Loading } from "./common/Loading";
import { usePopularMovies } from "../hooks/queries/usePopularMovies";
import type { MovieItem } from "../types/Movie.types";

export default function HomeView({
  initialMovies,
}: {
  initialMovies?: MovieItem[] | null;
}) {
  const { data: movies, isLoading } = usePopularMovies(initialMovies, {
    enabled: initialMovies == null,
  });

  if (isLoading === true) {
    return <Loading />;
  }

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
    </>
  );
}
