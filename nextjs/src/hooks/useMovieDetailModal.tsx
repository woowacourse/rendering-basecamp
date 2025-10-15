import { overlay } from "overlay-kit";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";
import { useRouter } from "next/router";

export const useMovieDetailModal = () => {
  const router = useRouter();
  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    router.push(`/detail/${movie.id}`, undefined, { shallow: true });
    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            resolve();
            unmount();
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
