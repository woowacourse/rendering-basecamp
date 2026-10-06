import { moviesApi } from "@/api/movies";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import MovieHomePage from "@/pages";
import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
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
      <Head>
        <title>{movieDetail.title}</title>
        <meta
          name="description"
          content={movieDetail.overview || `${movieDetail.title} 상세 정보`}
        />
        <meta property="og:title" content={movieDetail.title} />
        <meta
          property="og:description"
          content={movieDetail.overview || `${movieDetail.title} 상세 정보`}
        />
        <meta
          property="og:image"
          content={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
        />
        <meta property="og:type" content="website" />
      </Head>
      <MovieDetailModal
        movie={movieDetail}
        onClose={() => {
          void router.replace("/");
        }}
      />
    </>
  );
}
