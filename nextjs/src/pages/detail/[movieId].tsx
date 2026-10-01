import { moviesApi } from "@/api/movies";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import Home from "@/pages";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import type { MovieResponse } from "@/types/Movie.types";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";

interface Props {
  popularMovies: MovieResponse;
  movieDetail: MovieDetailResponse;
}

export const getServerSideProps = (async ({ params }) => {
  const movieId = Number(params?.movieId);
  if (Number.isNaN(movieId)) {
    return { notFound: true };
  }

  const [{ data: popularMovies }, { data: movieDetail }] = await Promise.all([
    moviesApi.getPopular(1),
    moviesApi.getDetail(movieId),
  ]);
  return { props: { popularMovies, movieDetail } };
}) satisfies GetServerSideProps<Props, { movieId: string }>;

export default function MovieDetailPage({ popularMovies, movieDetail }: Props) {
  const router = useRouter();

  return (
    <>
      <Home popularMovies={popularMovies} />
      <MovieDetailModal movie={movieDetail} onClose={() => router.push("/")} />
    </>
  );
}
