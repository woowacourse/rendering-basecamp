import { useRouter } from "next/router";
import { moviesApi } from "../../api/movies";

import Head from "next/head";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { MovieDetailModal } from "@/components/MovieDetailModal";

export const getServerSideProps = (async ({ params }) => {
  const movieId = Number(params?.movieId);
  const { data: movieDetail } = await moviesApi.getDetail(movieId);
  return { props: { movieDetail } };
}) satisfies GetServerSideProps<{ movieDetail: MovieDetailResponse }>;

export default function MovieDetailPage({
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{movieDetail.title}</title>
        <meta property="og:title" content={movieDetail.title} />
        <meta
          property="og:image"
          content={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
        />
        <meta property="og:description" content={movieDetail.overview} />
      </Head>

      <MovieDetailModal movie={movieDetail} onClose={() => void router.push("/")} />
    </>
  );
}
