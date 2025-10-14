import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MovieHomePage from "./MovieHomePage";
import { moviesApi } from "../api/movies";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieItem } from "../types/Movie.types";

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
  const { movieId } = useParams();
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
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
  }, [movieId, openMovieDetailModal]);

  return null;
}
