import { moviesApi } from "@/api/movies";
import MovieHomeContent from "@/components/common/MovieHomeContent";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState } from "react";
import { MovieDetailModal } from "@/components/MovieDetailModal";

export const getServerSideProps = (async ({ params }) => {
  const movieId = Number(params?.movieId); // url에서 영화id 빼옴
  const [popularRes, detailRes] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);
  return {
    props: {
      movies: popularRes.data.results,
      movieDetail: detailRes.data,
      movieId,
    },
  };
}) satisfies GetServerSideProps<{
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}>;

export default function MovieDetailPage({
  movies,
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  return (
    <>
      <Head>
        {/* 영화 메타데이터를 따로 설정하는 부분*/}
        <title>{movieDetail.title}</title>
        <meta property="og:type" content="article" />
        <meta property="og:title" content={movieDetail.title} />
        <meta property="og:description" content={movieDetail.overview} />
        <meta name="description" content={movieDetail.overview} />
        {movieDetail.poster_path && (
          <meta
            property="og:image"
            content={`https://image.tmdb.org/t/p/original${movieDetail.poster_path}`}
          />
        )}
      </Head>
      <MovieHomeContent movies={movies} />
      {isModalOpen && (
        <MovieDetailModal
          movie={movieDetail}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
