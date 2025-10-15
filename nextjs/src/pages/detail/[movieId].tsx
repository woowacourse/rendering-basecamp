import { useRouter } from "next/router";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { useEffect, useRef } from "react";
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
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) return;
    onceRef.current = true;

    (async () => {
      await openMovieDetailModal(detail);
      router.push("/");
    })();
  }, [detail, openMovieDetailModal, router]);

  return (
    <>
      <Head>
        <title>{detail.title}</title>
        <meta name='description' content={detail.overview} />

        <meta property='og:type' content='website' />
        <meta property='og:title' content={detail.title} />
        <meta property='og:description' content={detail.overview} />
        <meta
          property='og:image'
          content={
            detail.poster_path
              ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
              : "/default-thumbnail.png"
          }
        />
        {/* 추후 수정 예정 */}
        {/* <meta
          property='og:url'
          content={`https://hoyychoi.com/detail/${detail.id}`}
        /> */}
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
