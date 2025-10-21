import { Loading } from "../components/common/Loading";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { usePopularMovies } from "../hooks/queries/usePopularMovies";
import { MovieItem } from "../types/Movie.types";

interface Props {
  initialMovies: MovieItem[];
}

export default function MovieHomePage({ initialMovies }: Props) {
  const { data: popularMovies, isLoading } = usePopularMovies({
    initialMovies,
  });

  if (isLoading === true) {
    return <Loading />;
  }

  if (popularMovies == null || popularMovies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={popularMovies[0]} />
      <MovieList movies={popularMovies} />
      <Footer />
    </div>
  );
}
