import { useRouter } from "next/router";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { useEffect } from "react";
import { moviesApi } from "@/api/movies";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { MovieItem } from "@/types/Movie.types";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import Head from "next/head";

export default function MovieDetailPage({
  movies,
  detail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    (async () => {
      await openMovieDetailModal(detail);
      router.push("/");
    })();
  }, [detail, openMovieDetailModal, router]);

  return (
    <>
      <Head>
        <title>Detail</title>
        <meta name='description' content='Detail' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div id='wrap'>
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
      </div>
    </>
  );
}

export const getServerSideProps = (async (ctx) => {
  const id = ctx.params?.movieId;
  if (!id || Array.isArray(id)) return { notFound: true };

  const [popularRes, detailRes] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(id)),
  ]);

  return {
    props: {
      movies: popularRes.data.results,
      detail: detailRes.data,
    },
  };
}) satisfies GetServerSideProps<{
  movies: MovieItem[];
  detail: Omit<MovieItem, "genre_ids">;
}>;
