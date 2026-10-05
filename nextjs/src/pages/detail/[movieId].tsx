import { useRouter } from "next/router";

import { moviesApi } from "@/api/movies";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import MovieHomePage from "@/views/MovieHomePage";

import type { GetServerSideProps } from "next";
import type { MovieDetailPageData } from "@/types/MovieDetail.types";
import Head from "next/head";
import { useEffect, useState } from "react";
import { MovieItem } from "@/types/Movie.types";
import axios from "axios";

interface Props {
  movie: MovieDetailPageData;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const movieId = Number(params?.movieId);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    return { notFound: true };
  }

  try {
    const { data } = await moviesApi.getDetail(movieId);
    const movie: MovieDetailPageData = {
      id: data.id,
      title: data.title,
      genres: data.genres,
      overview: data.overview,
      vote_average: data.vote_average,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
    };
    return {
      props: {
        movie,
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { notFound: true };
    }

    throw error;
  }
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
