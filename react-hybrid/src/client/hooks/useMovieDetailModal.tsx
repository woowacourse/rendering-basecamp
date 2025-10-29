import { overlay } from 'overlay-kit';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { useHistory } from './useHistory';
import { useNavigationEvent } from './useNavigationEvent';

export const useMovieDetailModal = () => {
  const { navigate } = useHistory();

  useNavigationEvent((path) => {
    if (path === '/') {
      overlay.unmountAll();
    }
  });

  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            resolve();
            unmount();
            navigate('/');
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
