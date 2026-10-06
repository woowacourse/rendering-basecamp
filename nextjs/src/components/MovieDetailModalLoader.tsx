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

  // 첫 렌더(요청 시작 전)에는 data/error가 모두 없으므로 로딩으로 취급
  if (isLoading || (movie == null && error == null)) {
    return (
      <div className="modal-background active">
        <div className="modal">
          <Loading />
        </div>
      </div>
    );
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
