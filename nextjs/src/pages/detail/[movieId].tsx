import Head from "next/head";

import { useEffect, useRef } from "react";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { MovieHomePage } from "..";
import { moviesApi } from "../../api/movies";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

type Params = {
  movieId: string;
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export async function getServerSideProps(
  context: GetServerSidePropsContext<Params>,
) {
  const movieId = Number(context.params!.movieId);
  const [popularResult, detailResult] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);

  return {
    props: { movies: popularResult.data.results, detail: detailResult.data },
  };
}

export default function MovieDetailPage({ movies, detail }: Props) {
  return (
    <>
      <Head>
        <title>{detail.title}</title>
        <meta property="og:type" content="article" key="detail_type" />
        <meta property="og:title" content={detail.title} key="detail_title" />
        <meta
          property="og:description"
          content={detail.overview}
          key="detail_description"
        />
        <meta
          property="og:image"
          content={
            detail.poster_path
              ? `https://image.tmdb.org/t/p/original${detail.poster_path}`
              : "/images/no_image.png"
          }
          key="detail_image"
        />
      </Head>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal detail={detail} />
    </>
  );
}

function DetailPageOpenModal({ detail }: Pick<Props, "detail">) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) return;
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(detail);
    })();
  }, [detail, openMovieDetailModal]);

  return null;
}
