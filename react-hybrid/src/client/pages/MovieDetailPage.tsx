import MovieHomePage from './MovieHomePage';
import { MovieDetailModal } from '../components/MovieDetailModal';
import type { MovieItem } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';

interface MovieDetailPageProps {
  movies: MovieItem[] | null;
  movieDetail: MovieDetailResponse | null;
}

export default function MovieDetailPage({
  movies,
  movieDetail,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage movies={movies} />
      {movieDetail ? (
        <MovieDetailModal
          movie={movieDetail}
          onClose={() => window.location.assign('/')}
        />
      ) : (
        <p>영화 상세 정보를 불러오지 못했습니다.</p>
      )}
    </>
  );
}
