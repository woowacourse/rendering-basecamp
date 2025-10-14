"use client";

import { overlay } from "overlay-kit";
import { useRouter } from "next/router";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";

export const useMovieDetailModal = () => {
  const router = useRouter();

  const openMovieDetailModal = (movie: MovieDetailResponse) => {
    return new Promise<void>((resolve) => {
      overlay.open(({ unmount }) => (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            router.push("/");
            resolve();
            unmount();
          }}
        />
      ));
    });
  };

  return { openMovieDetailModal };
};
