import Link from 'next/link';
import { MovieItem } from './MovieItem';
import type { MovieItem as MovieItemType } from '../types/Movie.types';

export const MovieList = ({ movies }: { movies: MovieItemType[] }) => {
  return (
    <main>
      <section className="container">
        <h2 className="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul className="thumbnail-list">
          {movies.map(movie => (
            <li key={movie.id} className="movie-item" data-index={movie.id}>
              <Link
                href={`/detail/${movie.id}`}
                scroll={false}
                prefetch={false}
              >
                <MovieItem movie={movie} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};
