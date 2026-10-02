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
  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : null;

  return (
    <>
      <MovieHomePage movies={movies} />
      <Head>
        <title>{movieDetail.title}</title>
        <meta
          name="description"
          content={movieDetail.overview || `${movieDetail.title} 상세 정보`}
          key="description"
        />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:title" content={movieDetail.title} key="og:title" />
        <meta
          property="og:description"
          content={movieDetail.overview || `${movieDetail.title} 상세 정보`}
          key="og:description"
        />
        {imageUrl && (
          <meta property="og:image" content={imageUrl} key="og:image" />
        )}
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
