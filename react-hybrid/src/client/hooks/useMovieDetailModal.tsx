import { overlay } from 'overlay-kit';
import { MovieDetail } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetail) => {
    return new Promise<void>(resolve => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            resolve();
            unmount();
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
