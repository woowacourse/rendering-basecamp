import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { moviesApi } from "@/api/movies";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { MovieDetailResponse } from "@/types/MovieDetail.types";

interface MovieDetailPageProps {
  movieDetail: MovieDetailResponse;
}

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps
> = async context => {
  try {
    const movieId = context.params?.movieId as string;
    const response = await moviesApi.getDetail(Number(movieId));
    const movieDetail = response.data;

    return {
      props: {
        movieDetail,
      },
    };
  } catch (error) {
    console.error(error ?? "영화 상세 정보를 불러오는데 실패했습니다.");
    return {
      notFound: true,
    };
  }
};

export default function MovieDetailPage({
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
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
    if (onceRef.current === true) {
      return;
    }
    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}
