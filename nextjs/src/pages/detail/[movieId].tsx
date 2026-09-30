import { useRouter } from "next/router";

import { moviesApi } from "@/api/movies";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import MovieHomePage from "@/views/MovieHomePage";

import type { GetServerSideProps } from "next";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { MovieItem } from "@/types/Movie.types";

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
  return (
    <>
      <MovieHomePage movies={movies} />
      <MovieDetailModal movie={movie} onClose={() => void router.push("/")} />
    </>
  );
}
