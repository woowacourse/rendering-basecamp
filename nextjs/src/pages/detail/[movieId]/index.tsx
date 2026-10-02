import { moviesApi } from "@/api/movies";
import { Metadata } from "@/components/common/Metadata";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { toMovieMetadata } from "@/lib/movieDetail/metadata";
import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect } from "react";
import HomePage from "../../index";

export const getServerSideProps: GetServerSideProps<{
  movieDetail: MovieDetailResponse;
  movies: MovieItem[];
}> = async ({ params }) => {
  const movieId = Number(params?.movieId);
  const [movieDetail, popularMovies] = await Promise.all([
    moviesApi.getDetail(movieId),
    moviesApi.getPopular(),
  ]);

  return {
    props: {
      movieDetail: movieDetail.data,
      movies: popularMovies.data.results,
    },
  };
};

export default function DetailPage({
  movieDetail,
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Metadata data={toMovieMetadata(movieDetail)} />
      <HomePage movies={movies} />
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

  useEffect(() => {
    openMovieDetailModal(movieDetail);
  }, [openMovieDetailModal]);

  return null;
}
