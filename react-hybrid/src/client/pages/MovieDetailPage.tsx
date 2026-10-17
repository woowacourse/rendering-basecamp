import { useNavigate } from 'react-router-dom';
import MovieHomePage from './MovieHomePage';
import { MovieDetailModal } from '../components/MovieDetailModal';
import type { MovieItem } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';

interface MovieDetailPageProps {
  movies: MovieItem[];
  initialMovieDetail?: MovieDetailResponse;
}

export default function MovieDetailPage({
  movies,
  initialMovieDetail,
}: MovieDetailPageProps) {
  const navigate = useNavigate();

  return (
    <>
      <MovieHomePage movies={movies} />
      {initialMovieDetail ? (
        <MovieDetailModal
          movie={initialMovieDetail}
          onClose={() => navigate('/')}
        />
      ) : null}
    </>
  );
}
