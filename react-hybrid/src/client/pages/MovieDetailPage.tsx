import { useEffect } from "react";
import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import MovieHomePage from "./MovieHomePage";

type Props = {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
};

export default function MovieDetailPage({ movies, movieDetail }: Props) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

function DetailPageOpenModal({ movieDetail }) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    openMovieDetailModal(movieDetail);
  }, [openMovieDetailModal]);

  return null;
}
