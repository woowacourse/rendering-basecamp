import { overlay } from 'overlay-kit';
import { useCallback } from 'react';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';

export const useMovieDetailModal = () => {
  const openMovieDetailModal = useCallback((movie: MovieDetailResponse) => {
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
  }, []);

  return { openMovieDetailModal };
};
