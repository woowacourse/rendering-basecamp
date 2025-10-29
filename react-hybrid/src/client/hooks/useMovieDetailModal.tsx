import { overlay } from 'overlay-kit';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { useNavigate } from 'react-router-dom';

export const useMovieDetailModal = () => {
  const navigate = useNavigate();
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
