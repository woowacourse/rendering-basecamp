import { moviesApi } from "@/api/movies";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import MovieHomePage from "@/pages";
import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

type DetailPageParams = {
  movieId: string;
};

type DetailPageProps = {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
};

export const getServerSideProps: GetServerSideProps<
  DetailPageProps,
  DetailPageParams
> = async ({ params }) => {
  if (params?.movieId == null) {
    return {
      notFound: true,
    };
  }

  const { movieId } = params;

  const { data: moviesData } = await moviesApi.getPopular();
  const movies = moviesData.results;

  const { data: movieDetail } = await moviesApi.getDetail(Number(movieId));

  return {
    props: { movies, movieDetail },
  };
};

export default function MovieDetailPage({
  movies,
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  return (
    <>
      <MovieHomePage movies={movies} />
      <MovieDetailModal
        movie={movieDetail}
        onClose={() => {
          void router.replace("/");
        }}
      />{" "}
    </>
  );
}
