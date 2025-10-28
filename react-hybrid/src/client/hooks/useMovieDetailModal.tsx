import { overlay } from "overlay-kit";
import { useRef } from "react";
import { MovieDetailModal } from "../components/MovieDetailModal";
import { MovieDetailResponse } from "../types/MovieDetail.types";

export const useMovieDetailModal = () => {
  const unmountRef = useRef<(() => void) | null>(null);

  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    return new Promise<void>((resolve) => {
      const handleClose = () => {
        resolve();
        unmountRef.current?.();
        unmountRef.current = null;

        if (window.history.state?.modalOpen) {
          window.history.back();
        }
      };

      overlay.open(({ unmount }) => {
        unmountRef.current = unmount;
        return <MovieDetailModal movie={movie} onClose={handleClose} />;
      });

      window.history.pushState({ modalOpen: true }, "", window.location.href);

      const handlePopState = (e: PopStateEvent) => {
        if (!e.state?.modalOpen) {
          unmountRef.current?.();
          unmountRef.current = null;
          window.removeEventListener("popstate", handlePopState);
          resolve();
        }
      };

      window.addEventListener("popstate", handlePopState);
    });
  };

  return { openMovieDetailModal };
};
