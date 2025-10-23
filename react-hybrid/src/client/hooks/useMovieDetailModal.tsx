import { overlay } from 'overlay-kit';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { updatePageMeta, buildDetailPageMeta, buildHomePageMeta } from '../../server/utils/seoMeta';

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    return new Promise<void>(resolve => {
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", `/detail/${movie.id}`);
      }
      updatePageMeta(buildDetailPageMeta(movie));

      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            if (typeof window !== "undefined") {
              window.history.replaceState({}, "", "/");
            }
            const initialMovies =
              typeof window !== "undefined"
                ? window.__INITIAL_DATA__?.movies
                : undefined;
            updatePageMeta(buildHomePageMeta(initialMovies));
            resolve();
            unmount();
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
