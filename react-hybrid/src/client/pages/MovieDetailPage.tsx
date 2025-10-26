import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import MovieHomePage from "./MovieHomePage";
import { MovieResponse } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";

type Props = {
  popularMovie: MovieResponse;
  movieDetail: MovieDetailResponse;
};

export default function MovieDetailPage({ popularMovie, movieDetail }: Props) {
  return (
    <>
      <MovieHomePage movieData={popularMovie} />
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

function DetailPageOpenModal({
  movieDetail,
}: {
  movieDetail: MovieDetailResponse;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    (async () => {
      onceRef.current = true;

      openMovieDetailModal(movieDetail);
    })();
  }, [openMovieDetailModal]);

  return null;
}
