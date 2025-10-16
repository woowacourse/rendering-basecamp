import { moviesApi } from "@/api/movies";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  Metadata,
} from "next";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import Head from "next/head";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { MovieItem } from "@/types/Movie.types";
import { MovieList } from "@/components/MovieList";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {};

export const getServerSideProps = (async ({ params }) => {
  const res = await moviesApi.getDetail(Number(params?.id));
  const movieDetail: MovieDetailResponse = res.data;
  const moviesRes = await moviesApi.getPopular();
  const movies: MovieItem[] = moviesRes.data.results;

  return { props: { movies, movieDetail } };
}) satisfies GetServerSideProps<{
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}>;

export default function MovieDetailPage({
  movieDetail,
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const openedIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (openedIdRef.current === movieDetail.id) return;

    openedIdRef.current = movieDetail.id;
    openMovieDetailModal(movieDetail).finally(() => {
      window.history.replaceState(null, "", "/");
    });
  }, [movieDetail, openMovieDetailModal]);

  return (
    <>
      <Head>
        <title>{movieDetail.title}</title>
        <meta property="og:title" content={movieDetail.title} key="title" />
        <meta
          property="og:description"
          content={movieDetail.overview}
          key="description"
        />
        <meta
          property="og:image"
          content={`https://image.tmdb.org/t/p/original${movieDetail.poster_path}`}
          key="image"
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_URL}/detail/${movieDetail.id}`}
          key="url"
        />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
