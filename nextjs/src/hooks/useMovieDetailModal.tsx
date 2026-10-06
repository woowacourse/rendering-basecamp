import { overlay } from 'overlay-kit';
import { useCallback } from 'react';
import type { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';

export const useMovieDetailModal = () => {
  const openMovieDetailModal = useCallback(
    (movie: MovieDetailResponse, onClose?: () => void) =>
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            unmount();
            onClose?.();
          }}
        />
      )),
    []
  );

  return { openMovieDetailModal };
};
