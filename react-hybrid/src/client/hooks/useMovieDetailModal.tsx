import { overlay } from "overlay-kit";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";

export const useMovieDetailModal = () => {
  const handleClose = () => {
    window.history.pushState(null, "", "/");
  };

  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    window.history.pushState(null, "", `/detail/${movie.id}`);

    const unlistenPopState = () => {
      window.addEventListener("popstate", handleClose);
    };

    unlistenPopState();

    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            resolve();
            handleClose();
            unmount();
            window.removeEventListener("popstate", handleClose);
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
