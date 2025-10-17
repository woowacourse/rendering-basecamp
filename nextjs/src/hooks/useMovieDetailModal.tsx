import { overlay } from 'overlay-kit';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { useRouter } from 'next/router';

export const useMovieDetailModal = () => {
  const router = useRouter();

  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    let modalUnmount: (() => void) | null = null;

    const promise = new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => {
        modalUnmount = unmount;
        return (
          <MovieDetailModal
            movie={movie}
            onClose={() => {
              router.push('/');
              resolve();
              unmount();
            }}
          />
        );
      });
    });

    return {
      promise,
      unmount: () => modalUnmount?.(),
    };
  };

  return { openMovieDetailModal };
};
