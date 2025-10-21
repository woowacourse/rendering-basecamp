import { overlay } from "overlay-kit";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";
import { applyMeta, buildDetailMeta, buildHomeMeta } from "../utils/meta";

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    return new Promise<void>((resolve) => {
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", `/detail/${movie.id}`);
      }
      applyMeta(buildDetailMeta(movie));
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
            applyMeta(buildHomeMeta(initialMovies));
            resolve();
            unmount();
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
