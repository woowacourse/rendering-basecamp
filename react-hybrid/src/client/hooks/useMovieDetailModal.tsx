import { overlay } from "overlay-kit";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    window.history.pushState(null, "", `/detail/${movie.id}`);

    return new Promise<void>((resolve) => {
      const unmount = overlay.open(({ unmount }) => {
        const handleClose = () => {
          resolve();
          unmount();
          window.removeEventListener("popstate", handlePopState);
        };

        const handlePopState = () => {
          handleClose();
        };

        window.addEventListener("popstate", handlePopState);

        return <MovieDetailModal movie={movie} onClose={handleClose} />;
      });
    });
  };

  return { openMovieDetailModal };
};
