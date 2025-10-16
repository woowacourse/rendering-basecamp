import { useMovieDetail } from '../hooks/queries/useMovieDetail';
import { MovieDetailModal } from './MovieDetailModal';
import { Loading } from './common/Loading';

interface MovieDetailModalLoaderProps {
  movieId: number;
  close: () => void;
}

export const MovieDetailModalLoader = ({
  movieId,
  close,
}: MovieDetailModalLoaderProps) => {
  const { data: movie, isLoading, error } = useMovieDetail(movieId);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="modal-background active">
        <div className="modal">
          <div className="modal-container">
            <p>영화 정보를 불러오는데 실패했습니다.</p>
            <p>{error.message}</p>
            <button onClick={close}>닫기</button>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="modal-background active">
        <div className="modal">
          <div className="modal-container">
            <p>영화 정보를 찾을 수 없습니다.</p>
            <button onClick={close}>닫기</button>
          </div>
        </div>
      </div>
    );
  }

  return <MovieDetailModal movie={movie} onClose={close} />;
};
