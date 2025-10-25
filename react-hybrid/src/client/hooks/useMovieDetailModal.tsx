import { overlay } from "overlay-kit";
import type { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    window.history.pushState(null, "", `/detail/${movie.id}`);

    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            resolve();
            unmount();
            window.history.pushState(null, "", `/`);
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
