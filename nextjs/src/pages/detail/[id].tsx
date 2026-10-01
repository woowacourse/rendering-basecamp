import type { GetServerSideProps } from "next";
import Head from "next/head";
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
  const title = `${movieDetail.title} | Movielist`;
  const description =
    movieDetail.overview || `${movieDetail.title}의 상세 정보를 확인해 보세요.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
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
