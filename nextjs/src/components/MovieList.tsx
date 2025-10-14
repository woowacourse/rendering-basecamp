import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { MovieItem } from './MovieItem';
import type { MovieItem as MovieItemType } from '../types/Movie.types';
import { moviesApi } from '../api/movies';
import styles from './MovieList.module.css';

export const MovieList = ({ movies }: { movies: MovieItemType[] }) => {
  const { openMovieDetailModal } = useMovieDetailModal();

  const handleMovieClick = async (movie: MovieItemType) => {
    const movieDetail = await moviesApi.getDetail(movie.id);
    await openMovieDetailModal(movieDetail.data);
  };

  return (
    <main>
      <section className={styles.container}>
        <h2 className="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul className={styles.thumbnailList}>
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
