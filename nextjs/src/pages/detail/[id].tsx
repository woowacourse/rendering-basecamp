import type { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import MovieHomePage from "../index";
import { moviesApi } from "../../api/movies";
import { useMovieDetailModal } from "../../hooks/useMovieDetailModal";
import type { MovieItem } from "../../types/Movie.types";
import type { MovieDetailResponse } from "../../types/MovieDetail.types";

interface Props {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  const id = Number(params?.id);

  const [popular, detail] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(id),
  ]);

  return {
    props: {
      movies: popular.data.results,
      movieDetail: detail.data,
    },
  };
};

export default function MovieDetailPage({ movies, movieDetail }: Props) {
  return (
    <>
      <MovieHomePage movies={movies} />
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
    if (onceRef.current) return;
    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}
