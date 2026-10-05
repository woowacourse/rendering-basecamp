import { useRouter } from "next/router";

import { moviesApi } from "@/api/movies";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import MovieHomePage from "@/views/MovieHomePage";

import type { GetServerSideProps } from "next";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import Head from "next/head";
import { useEffect, useState } from "react";
import { MovieItem } from "@/types/Movie.types";

interface Props {
  movie: MovieDetailResponse;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const movieId = Number(params?.movieId);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    return { notFound: true };
  }

  const { data: movie } = await moviesApi.getDetail(movieId);

  return {
    props: {
      movie,
    },
  };
};

export default function MovieDetailPage({ movie }: Props) {
  const router = useRouter();
  const [popularMovies, setPopularMovies] = useState<MovieItem[]>([]);

  const imagePath = movie.backdrop_path ?? movie.poster_path;
  const ogImage = imagePath ? `https://image.tmdb.org/t/p/w1280${imagePath}` : undefined;

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const { data } = await moviesApi.getPopular();
        setPopularMovies(data.results);
      } catch {
        setPopularMovies([]);
      }
    };
    void fetchPopularMovies();
  }, []);

  return (
    <>
      <Head>
        <title>{movie.title} | 영화 리뷰</title>
        <meta name="description" content={movie.overview} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={movie.title} />
        <meta property="og:description" content={movie.overview} />
        {ogImage && <meta property="og:image" content={ogImage} />}
      </Head>
      {popularMovies.length > 0 && <MovieHomePage movies={popularMovies} />}{" "}
      <MovieDetailModal movie={movie} onClose={() => void router.push("/")} />
    </>
  );
}
