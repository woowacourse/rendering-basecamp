import { overlay } from 'overlay-kit';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { useRouter } from 'next/router';

export const useMovieDetailModal = () => {
  const router = useRouter();
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            resolve();
            unmount();
            router.replace('/', undefined, { shallow: true });
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
