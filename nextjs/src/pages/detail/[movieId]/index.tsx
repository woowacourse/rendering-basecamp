import { moviesApi } from "@/api/movies";
import { Metadata } from "@/components/common/Metadata";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { toMovieMetadata } from "@/lib/movieDetail/metadata";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect } from "react";
import HomePage from "../../index";

export const getServerSideProps: GetServerSideProps<{
  movieDetail: MovieDetailResponse;
}> = async ({ params }) => {
  const movieId = Number(params?.movieId);
  const movieDetail = await moviesApi.getDetail(movieId);

  return { props: { movieDetail: movieDetail.data } };
};

export default function DetailPage({
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Metadata data={toMovieMetadata(movieDetail)} />
      <HomePage />
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
