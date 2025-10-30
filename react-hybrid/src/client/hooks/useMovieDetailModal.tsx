import { overlay } from 'overlay-kit';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    return new Promise<void>(resolve => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            resolve();
            unmount();
            window.location.href = '/';
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
