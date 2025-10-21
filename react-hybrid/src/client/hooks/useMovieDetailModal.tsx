import { overlay } from "overlay-kit";
import { MovieDetailModal } from "../components/MovieDetailModal";
import { MovieDetailResponse } from "../types/MovieDetail.types";

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            window.history.pushState({}, "", "/");
            resolve();
            unmount();
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
