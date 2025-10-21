import { overlay } from "overlay-kit";
import { MovieDetailModal } from "../components/MovieDetailModal";
import { MovieDetailResponse } from "../types/MovieDetail.types";

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    const unmountRef = { current: null as null | (() => void) };

    const open = () => {
      overlay.open(({ unmount }) => {
        unmountRef.current = unmount;

        return (
          <MovieDetailModal
            movie={movie}
            onClose={() => {
              window.history.pushState({}, "", "/");
              unmount();
            }}
          />
        );
      });
    };

    const handlePopState = () => {
      const path = window.location.pathname;

      if (path === "/") unmountRef.current?.();
      else if (path.startsWith("/detail/")) open();
    };

    window.addEventListener("popstate", handlePopState);
    open();

    return () => {
      window.removeEventListener("popstate", handlePopState);
      unmountRef.current?.();
    };
  };

  return { openMovieDetailModal };
};
