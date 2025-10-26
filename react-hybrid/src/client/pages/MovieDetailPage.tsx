import { MovieDetailModal } from '../components/MovieDetailModal';
import { MovieItem } from '../types/Movie.types';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import MovieHomePage from './MovieHomePage';

interface MovieDetailPageProps {
  movies: MovieItem[];
  detail: MovieDetailResponse
}

export default function MovieDetailPage({ movies, detail }: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <MovieDetailModal
        movie={detail}
        onClose={() => {
          window.history.back();
        }}
      />
    </>
  );
}