import { MovieItem } from "./MovieItem";
import type { MovieItem as MovieItemType } from "../types/Movie.types";
import { useRouter } from "next/router";

export const MovieList = ({ movies }: { movies: MovieItemType[] }) => {
  const router = useRouter();

  const handleMovieClick = async (movie: MovieItemType) => {
    // 홈에서는 shallow routing으로 URL만 업데이트해 스크롤/렌더를 보존
    if (router.pathname === "/") {
      await router.replace(
        { pathname: router.pathname, query: { movieId: movie.id } },
        undefined,
        { shallow: true }
      );
      return;
    }
    await router.push(`/detail/${movie.id}`);
  };

  return (
    <main>
      <section className="container">
        <h2 className="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul className="thumbnail-list">
          {movies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              onClick={handleMovieClick}
            />
          ))}
        </ul>
      </section>
    </main>
  );
};
