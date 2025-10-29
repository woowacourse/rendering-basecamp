import { overlay } from "overlay-kit";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movieDetail: MovieDetailResponse) => {
    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movieDetail={movieDetail}
          onClose={() => {
            resolve();
            unmount();
            window.location.href = `/`;
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
