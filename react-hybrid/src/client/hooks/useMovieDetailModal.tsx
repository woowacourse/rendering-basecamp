import { overlay } from 'overlay-kit';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    window.history.pushState(
      { modal: true, movieId: movie.id },
      '',
      `/details/${movie.id}`
    );

    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => {
        const closeModal = () => {
          unmount();
          window.history.pushState({}, '', '/');
        };

        const handlePop = () => {
          const path = window.location.pathname;
          if (path.startsWith('/details/')) {
            openMovieDetailModal(movie);
          }
        };
        window.addEventListener('popstate', handlePop);

        return (
          <MovieDetailModal
            movie={movie}
            onClose={() => {
              resolve();
              closeModal();
              window.removeEventListener('popstate', handlePop);
            }}
          />
        );
      });
    });
  };

  return { openMovieDetailModal };
};
