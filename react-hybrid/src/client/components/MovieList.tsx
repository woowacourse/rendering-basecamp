import { MovieItem } from './MovieItem';
import type { MovieItem as MovieItemType } from '../types/Movie.types';
import { useNavigate } from 'react-router-dom';

export const MovieList = ({ movies }: { movies: MovieItemType[] }) => {
  const navigate = useNavigate();

  const handleMovieClick = (movie: MovieItemType) => {
    navigate(`/detail/${movie.id}`);
  };

  return (
    <main>
      <section className="container">
        <h2 className="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul className="thumbnail-list">
          {movies.map(movie => (
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
