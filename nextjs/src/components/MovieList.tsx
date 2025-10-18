import Link from 'next/link';
import type { MovieItem as MovieItemType } from '../types/Movie.types';
import { MovieItem } from './MovieItem';

export const MovieList = ({ movies }: { movies: MovieItemType[] }) => {
  return (
    <main>
      <section className="container">
        <h2 className="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul className="thumbnail-list">
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
