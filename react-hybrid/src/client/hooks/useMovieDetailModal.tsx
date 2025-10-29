import { overlay } from "overlay-kit";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";
import { updateMetaTags, restoreOriginalMetaTags } from "../utils/metaData";

export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    const detailPath = `/detail/${movie.id}`;

    window.history.pushState({ movieId: movie.id }, "", detailPath);
    updateMetaTags(movie);

    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            resolve();
            unmount();
            window.history.back();
            restoreOriginalMetaTags();
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
