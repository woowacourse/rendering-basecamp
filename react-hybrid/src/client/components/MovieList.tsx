import type { MovieItem as MovieItemType } from "../types/Movie.types";
import { MovieItem } from "./MovieItem";

type MovieListProps = {
  movies: MovieItemType[];
  onSelectMovie: (movieId: number) => void;
};

export const MovieList = ({ movies, onSelectMovie }: MovieListProps) => {
  const handleItemClick = (movie: MovieItemType) => {
    onSelectMovie(movie.id);
  };

  return (
    <main>
      <section className="container">
        <h2 className="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul className="thumbnail-list">
          {movies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} onClick={handleItemClick} />
          ))}
        </ul>
      </section>
    </main>
  );
};
