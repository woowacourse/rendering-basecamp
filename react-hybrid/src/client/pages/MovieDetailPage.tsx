import { useEffect, useRef } from "react";
import { moviesApi } from "../api/movies";
import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { MovieItem } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import MovieHomePage from "./MovieHomePage";

interface MovieDetailPageProps {
  movie: MovieDetailResponse;
  moviesServerData: MovieItem[];
}

export default function MovieDetailPage({
  movie,
  moviesServerData,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieHomePage moviesServerData={moviesServerData} />
      <DetailPageOpenModal movie={movie} />
    </>
  );
}

interface DetailPageOpenModalProps {
  movie: MovieDetailResponse;
}

function DetailPageOpenModal({ movie }: DetailPageOpenModalProps) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    const movieId = window.location.pathname.split("/")[2];

    if (movieId == null || onceRef.current === true) {
      return;
    }

    (async () => {
      onceRef.current = true;
      if (movie) {
        openMovieDetailModal(movie);
      } else {
        const movieDetail = await moviesApi.getDetail(Number(movieId));
        openMovieDetailModal(movieDetail.data);
      }
    })();
  }, [openMovieDetailModal]);

  return null;
}
