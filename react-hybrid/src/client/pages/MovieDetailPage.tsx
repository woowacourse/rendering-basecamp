import MovieHomePage from './MovieHomePage';
import { MovieDetailModal } from '../components/MovieDetailModal';
import type { MovieItem } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';

export default function MovieDetailPage({
  movies,
  movieDetail,
}: {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}) {
  return (
    <>
      <MovieHomePage initialMovies={movies} />
      <MovieDetailModal
        movie={movieDetail}
        onClose={() => window.location.assign('/')}
      />
    </>
  );
}
