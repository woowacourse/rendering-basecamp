import { moviesApi } from "@/api/movies";
import { Metadata } from "@/components/common/Metadata";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import { toMovieMetadata } from "@/lib/movieDetail/metadata";
import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import HomePage from "../../index";

export const getServerSideProps: GetServerSideProps<{
  movieDetail: MovieDetailResponse;
  movies: MovieItem[];
}> = async ({ params }) => {
  const movieId = Number(params?.movieId);
  const [movieDetail, popularMovies] = await Promise.all([
    moviesApi.getDetail(movieId),
    moviesApi.getPopular(),
  ]);

  return {
    props: {
      movieDetail: movieDetail.data,
      movies: popularMovies.data.results,
    },
  };
};

export default function DetailPage({
  movieDetail,
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <>
      <Metadata data={toMovieMetadata(movieDetail)} />
      <HomePage movies={movies} />
      <MovieDetailModal
        movie={movieDetail}
        onClose={() => {
          router.replace("/");
        }}
      />
    </>
  );
}
