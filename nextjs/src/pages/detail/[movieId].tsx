import Head from "next/head";
import { moviesApi } from "../../api/movies";
import MovieHomePage from "@/components/MovieHomePage";
import { useEffect, useRef } from "react";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const movieId = Number(context.params!.movieId);
  const res = await moviesApi.getDetail(movieId);

  const host = context.req.headers.host;
  const protocol = context.req.headers["x-forwarded-proto"] || "https";
  const origin = `${protocol}://${host}`;

  return {
    props: {
      movie: res.data,
      origin,
    },
  };
}

interface MovieDetailPage {
  movie: MovieDetailResponse;
  origin: string;
}

export default function MovieDetailPage({ movie, origin }: MovieDetailPage) {
  console.log("movie", movie);
  const { title, overview, vote_average, poster_path, id } = movie;

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/original${poster_path}`
    : "/images/no_image.png";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={overview} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={`${origin}/${id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Movie App" />
      </Head>

      <MovieHomePage />
      <DetailPageOpenModal movie={movie} />
    </>
  );
}

function DetailPageOpenModal({ movie }: { movie: MovieDetailResponse }) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) return;
    onceRef.current = true;
    openMovieDetailModal(movie);
  }, [movie, openMovieDetailModal]);

  return null;
}
