import { useEffect } from "react";
import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieHomePage } from "./MovieHomePage";
import { useMovieDetailModal } from "../hooks/useMovieDetailModal";

interface MovieDetailPageProps {
  initialMovies: MovieItem[];
  selectedMovieDetail?: MovieDetailResponse;
}

export const MovieDetailPage = ({
  initialMovies,
  selectedMovieDetail,
}: MovieDetailPageProps) => {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    if (selectedMovieDetail) {
      openMovieDetailModal(selectedMovieDetail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <MovieHomePage initialMovies={initialMovies} />;
};
