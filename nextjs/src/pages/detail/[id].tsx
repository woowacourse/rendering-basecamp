import { moviesApi } from "@/api/movies";
import MovieHomePage from "@/components/MovieHomePage";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect, useRef } from "react";
import Head from "next/head";

export const getServerSideProps = (async (context) => {
  const movieId = Number(context.params?.id);

  try {
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);
    return {
      props: {
        movies: popularResponse.data.results,
        movieDetail: detailResponse.data,
      },
    };
  } catch {
    return { notFound: true };
  }
}) satisfies GetServerSideProps<{
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}>;

export default function MovieDetailPage({
  movies,
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
    : null;
  return (
    <>
      <Head>
        <title>{`${movieDetail.title} - 영화 리뷰`}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={movieDetail.title} />
        <meta property="og:description" content={movieDetail.overview} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
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
    if (onceRef.current === true) {
      return;
    }
    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}
