import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MovieHomePage from "./MovieHomePage";
import { moviesApi } from "../api/movies";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieItem } from "../types/Movie.types";

type MovieDetailPageProps = {
  initialMovies?: MovieItem[];
  movieDetail?: MovieDetailResponse;
};

export default function MovieDetailPage({
  initialMovies,
  movieDetail,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage initialMovies={initialMovies} />
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

function DetailPageOpenModal({
  movieDetail,
}: {
  movieDetail?: MovieDetailResponse;
}) {
  const { id } = useParams();
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (id == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      if (movieDetail) {
        openMovieDetailModal(movieDetail);
      } else {
        const movieDetailData = await moviesApi.getDetail(Number(id));
        openMovieDetailModal(movieDetailData.data);
      }
    })();
  }, [id, openMovieDetailModal, movieDetail]);

  return null;
}
