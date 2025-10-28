import { overlay } from 'overlay-kit';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    // URL이 /detail/:id가 아닐 때만 URL 업데이트
    if (!window.location.pathname.startsWith('/detail/')) {
      window.history.pushState({}, '', `/detail/${movie.id}`);
    }

    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            resolve();
            unmount();
            // 모달이 닫힐 때 이전 URL로 돌아가기
            window.history.pushState({}, '', '/');
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
