import { useRouter } from "next/router";

import { moviesApi } from "@/api/movies";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import MovieHomePage from "@/views/MovieHomePage";

import type { GetServerSideProps } from "next";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { MovieItem } from "@/types/Movie.types";
import Head from "next/head";

interface Props {
  movie: MovieDetailResponse;
  movies: MovieItem[];
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const movieId = Number(params?.movieId);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    return { notFound: true };
  }

  const [{ data: movie }, { data: popularMovies }] = await Promise.all([
    moviesApi.getDetail(movieId),
    moviesApi.getPopular(),
  ]);

  return {
    props: {
      movie,
      movies: popularMovies.results,
    },
  };
};

export default function MovieDetailPage({ movie, movies }: Props) {
  const router = useRouter();

  const imagePath = movie.backdrop_path ?? movie.poster_path;
  const ogImage = imagePath ? `https://image.tmdb.org/t/p/w1280${imagePath}` : undefined;

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
      <MovieHomePage movies={movies} />
      <MovieDetailModal movie={movie} onClose={() => void router.push("/")} />
    </>
  );
}
