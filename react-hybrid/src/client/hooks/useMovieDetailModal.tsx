import { useEffect, useRef } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { MovieDetailModal } from "../components/MovieDetailModal";
import { MovieDetailResponse } from "../types/MovieDetail.types";

export const useMovieDetailModal = () => {
  const overlay = useOverlay();
  const unmountRef = useRef<(() => void) | null>(null);

  const openMovieDetailModal = async (movie: MovieDetailResponse) => {
    const handleClose = () => {
      window.history.pushState(null, "", "/");
      unmountRef.current?.();
    };

    const open = () => {
      unmountRef.current = overlay.open(({ isOpen, close }) => (
        <MovieDetailModal movie={movie} onClose={close} />
      ));
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
