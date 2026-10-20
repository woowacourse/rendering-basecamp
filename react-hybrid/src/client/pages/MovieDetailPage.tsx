import { MovieDetailModal } from '../components/MovieDetailModal';
import MovieHomePage from './MovieHomePage';
import type { MovieItem } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';

type Props = {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
};

export default function MovieDetailPage({ movies, movieDetail }: Props) {
  return (
    <>
      <MovieHomePage movies={movies} />
      {movieDetail && (
        <MovieDetailModal
          movie={movieDetail}
          onClose={() => window.location.replace('/')}
        />
      )}
    </>
  );
}
