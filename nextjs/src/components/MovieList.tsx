import { MovieItem } from "@/components/MovieItem";
import type { MovieItem as MovieItemType } from "@/types/Movie.types";
import styles from "./MovieList.module.css";
import Link from "next/link";

export const MovieList = ({ movies }: { movies: MovieItemType[] }) => {
  return (
    <main>
      <section className={styles.container}>
        <h2 className="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul className={styles.thumbnailList}>
          {movies.map(movie => (
            <Link key={movie.id} href={`/detail/${movie.id}`}>
              <MovieItem movie={movie} />
            </Link>
          ))}
        </ul>
      </section>
    </main>
  );
};
