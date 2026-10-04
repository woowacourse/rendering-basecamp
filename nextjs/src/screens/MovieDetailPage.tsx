import { useRouter } from "next/router";
import type { MovieItem } from "../types/Movie.types";
import type { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";
import MovieHomePage from "./MovieHomePage";

export type MovieDetailPageProps = {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
};

export default function MovieDetailPage({
  movies,
  movieDetail,
}: MovieDetailPageProps) {
  const router = useRouter();

  return (
    <>
      <MovieHomePage movies={movies} />
      <MovieDetailModal
        movie={movieDetail}
        onClose={() => void router.push("/")}
      />
    </>
  );
}
