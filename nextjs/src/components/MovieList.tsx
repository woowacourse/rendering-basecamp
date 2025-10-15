import Link from "next/link";
import { MovieItem } from "./MovieItem";
import type { MovieItemType } from "@/types/Movie.types";

export const MovieList = ({ movies }: { movies: MovieItemType[] }) => {
  return (
    <main>
      <section className="container">
        <h2 className="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul className="thumbnail-list">
          {movies.map((movie) => (
            <li className="movie-item" data-index={movie.id} key={movie.id}>
              <Link href={`/detail/${movie.id}`}>
                <MovieItem movie={movie} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};
