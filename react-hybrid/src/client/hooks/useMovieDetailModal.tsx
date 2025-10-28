import { overlay } from "overlay-kit";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    overlay.open(({ unmount }) => (
      <MovieDetailModal
        movie={movie}
        onClose={() => {
          unmount();
          window.location.replace("/");
        }}
      />
    ));
  };

  return { openMovieDetailModal };
};
