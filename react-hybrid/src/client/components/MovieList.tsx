import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { MovieItem } from './MovieItem';
import type { MovieItem as MovieItemType } from '../types/Movie.types';
import { moviesApi } from '../api/movies';

export const MovieList = ({ movies }: { movies: MovieItemType[] }) => {
  const { openMovieDetailModal } = useMovieDetailModal();

  const handleMovieClick = async (movie: MovieItemType) => {
    const movieDetail = await moviesApi.getDetail(movie.id);
    const prevPath = window.location.pathname;

    if (prevPath !== `/detail/${movie.id}`) {
      window.history.pushState(
        { movieId: movie.id },
        '',
        `/detail/${movie.id}`
      );
    }

    try {
      await openMovieDetailModal(movieDetail.data);
    } finally {
      window.history.replaceState({}, '', prevPath);
    }
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
