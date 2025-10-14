import { useEffect, useRef, type ReactElement } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import MovieHomePage from "../MovieHomePage";
import { moviesApi } from "../../api/movies";
import { useMovieDetailModal } from "../../hooks/useMovieDetailModal";
import Layout from "../../components/Layout";
import type { NextPageWithLayout } from "../_app";

const MovieDetailPage: NextPageWithLayout<{
  movieForOg: { title: string; overview: string; ogImage: string };
}> = ({
  movieForOg,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>{movieForOg.title}</title>
        <meta name="description" content={movieForOg.overview} />
        <meta property="og:title" content={movieForOg.title} />
        <meta property="og:description" content={movieForOg.overview} />
        <meta property="og:image" content={movieForOg.ogImage} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={movieForOg.title} />
        <meta property="twitter:description" content={movieForOg.overview} />
        <meta property="twitter:image" content={movieForOg.ogImage} />
      </Head>
      <MovieHomePage />
      <DetailPageOpenModal />
    </>
  );
};

function DetailPageOpenModal() {
  const router = useRouter();
  const { movieId } = router.query;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (typeof movieId !== "string" || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      await openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, openMovieDetailModal]);

  return null;
}

export const getServerSideProps: GetServerSideProps<{
  movieForOg: { title: string; overview: string; ogImage: string };
}> = async (ctx) => {
  const { movieId } = ctx.query;
  if (typeof movieId !== "string") {
    return { notFound: true };
  }

  try {
    const res = await moviesApi.getDetail(Number(movieId));
    const movie = res.data;

    const proto = (ctx.req.headers["x-forwarded-proto"] as string) ?? "http";
    const host =
      (ctx.req.headers["x-forwarded-host"] as string) ??
      ctx.req.headers.host ??
      "localhost:3000";
    const origin = `${proto}://${host}`;

    const ogImage = movie.poster_path
      ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
      : `${origin}/images/no_image.png`;

    return {
      props: {
        movieForOg: {
          title: movie.title,
          overview: movie.overview ?? "",
          ogImage,
        },
      },
    };
  } catch {
    return { notFound: true };
  }
};

MovieDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MovieDetailPage;
