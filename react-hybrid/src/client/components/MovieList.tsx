import type { MovieItem as MovieItemType } from "../types/Movie.types";
import { MovieItem } from "./MovieItem";

export const MovieList = ({ movies }: { movies: MovieItemType[] }) => {
  const handleMovieClick = (movieId: number) => {
    window.location.href = `/detail/${movieId}`;
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
              onClick={() => handleMovieClick(movie.id)}
            />
          ))}
        </ul>
      </section>
    </main>
  );
};
