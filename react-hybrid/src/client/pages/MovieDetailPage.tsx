import { useNavigate } from "react-router-dom";
import MovieHomePage from "./MovieHomePage";

import { MovieItem } from "../types/Movie.types";
import { MovieDetailModal } from "../components/MovieDetailModal";
import { MovieDetailResponse } from "../types/MovieDetail.types";

type MovieDetailPageProps = {
  movies: MovieItem[];
  movie?: MovieDetailResponse;
};

export default function MovieDetailPage({
  movies,
  movie,
}: MovieDetailPageProps) {
  const navigate = useNavigate();

  return (
    <>
      <MovieHomePage movies={movies} />
      {movie && (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            navigate("/");
          }}
        />
      )}
    </>
  );
}
