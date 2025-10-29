import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { MovieItem } from './MovieItem';
import type { MovieItem as MovieItemType } from '../types/Movie.types';
import { moviesApi } from '../api/movies';
import { useHistory } from '../hooks/useHistory';

export const MovieList = ({ movies }: { movies: MovieItemType[] }) => {
  const { navigate } = useHistory();
  const { openMovieDetailModal } = useMovieDetailModal();

  const handleMovieClick = async (movie: MovieItemType) => {
    navigate(`/detail/${movie.id}`);
    const movieDetail = await moviesApi.getDetail(movie.id);
    await openMovieDetailModal(movieDetail.data);
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
