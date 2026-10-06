import { MovieItem } from './MovieItem';
import type { MovieItem as MovieItemType } from '../types/Movie.types';

interface MovieListProps {
  movies: MovieItemType[];
  error?: Error | null;
}

export const MovieList = ({ movies, error }: MovieListProps) => {
  return (
    <main>
      <section className="container">
        <h2 className="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul className="thumbnail-list">
          {error ? (
            <li className="result-container" role="alert">
              <p className="text-xl font-semibold">영화 목록을 불러오지 못했습니다.</p>
              <p className="text-opacity-blue">{error.message}</p>
            </li>
          ) : (
            movies.map(movie => (
              <li key={movie.id} className="movie-item" data-index={movie.id}>
                <MovieItem movie={movie} />
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
};
