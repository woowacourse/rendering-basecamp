import MovieHomePage from './MovieHomePage';
import { MovieDetailModal } from '../components/MovieDetailModal';
import type { MovieItem } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';
import { useMovieDetail } from '../hooks/queries/useMovieDetail';
import { Loading } from '../components/common/Loading';

interface MovieDetailPageProps {
  movieId?: number;
  movies: MovieItem[] | null;
  movieDetail: MovieDetailResponse | null;
}

export default function MovieDetailPage({
  movieId,
  movies,
  movieDetail,
}: MovieDetailPageProps) {
  const { data: movie, isLoading, error } = useMovieDetail(movieId, movieDetail);

  return (
    <>
      <MovieHomePage movies={movies} />
      {isLoading ? (
        <Loading />
      ) : error || !movie ? (
        <p>영화 상세 정보를 불러오지 못했습니다.</p>
      ) : (
        <MovieDetailModal
          movie={movie}
          onClose={() => window.location.assign('/')}
        />
      )}
    </>
  );
}
