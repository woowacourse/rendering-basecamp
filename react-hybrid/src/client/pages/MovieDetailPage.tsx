import MovieHomePage from "./MovieHomePage";
import { MovieDetailModal } from "../components/MovieDetailModal";
import type { MovieItem } from "../types/Movie.types";
import type { MovieDetailResponse } from "../types/MovieDetail.types";

interface MovieDetailPageProps {
  movies: MovieItem[];
  detailMovie: MovieDetailResponse;
}

export default function MovieDetailPage({
  movies,
  detailMovie,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <MovieDetailModal
        movie={detailMovie}
        onClose={() => window.location.assign("/")}
      />
    </>
  );
}
