import { useCallback } from 'react';
import { overlay } from 'overlay-kit';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';

export const useMovieDetailModal = () => {
  const openMovieDetailModal = useCallback((movie: MovieDetailResponse) => {
    const overlayId = overlay.open(({ unmount }) => (
      <MovieDetailModal movie={movie} onClose={unmount} />
    ));

    return () => overlay.unmount(overlayId);
  }, []);

  return { openMovieDetailModal };
};
