import { useRouter } from "next/router";

import { moviesApi } from "@/api/movies";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import MovieHomePage from "@/views/MovieHomePage";
import { GetServerSideProps } from "next";

interface Props {
  movie: MovieDetailResponse;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const movieId = Number(params?.movieId);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    return { notFound: true };
  }

  const { data: movie } = await moviesApi.getDetail(movieId);

  return { props: { movie } };
};

export default function MovieDetailPage({ movie }: Props) {
  const router = useRouter();
  return (
    <>
      <MovieHomePage />
      <MovieDetailModal movie={movie} onClose={() => void router.push("/")} />
    </>
  );
}
