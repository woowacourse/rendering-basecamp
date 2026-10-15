import MovieHomePage from "./MovieHomePage";
import { MovieDetailModal } from "../components/MovieDetailModal";

import type { MovieItem } from "../types/Movie.types";
import type { MovieDetailResponse } from "../types/MovieDetail.types";

interface Props {
  movie: MovieDetailResponse;
  movies: MovieItem[];
}

export default function MovieDetailPage({ movie, movies }: Props) {
  return (
    <>
      <MovieHomePage initialMovies={movies} />

      <MovieDetailModal
        movie={movie}
        onClose={() => {
          window.location.href = "/";
        }}
      />
    </>
  );
}
