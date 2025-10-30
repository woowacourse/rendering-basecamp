import { overlay } from "overlay-kit";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";
import router from "../../server/routes";

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    window.history.pushState({}, "", `/detail/${movie.id}`);
    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            resolve();
            unmount();
            window.history.pushState({}, "", "/");
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
