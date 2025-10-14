import Head from "next/head";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import HomeView from "../components/HomeView";
import { moviesApi } from "../api/movies";
import type { MovieItem } from "../types/Movie.types";
import type { NextPageWithLayout } from "./_app";
import type { ReactElement } from "react";
import Layout from "../components/Layout";

const Home: NextPageWithLayout<{
  initialMovies: MovieItem[] | null;
  movieForOg?: { title: string; overview: string; ogImage: string } | null;
}> = ({
  initialMovies,
  movieForOg,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>{movieForOg ? movieForOg.title : "인기 영화"}</title>
        <meta
          name="description"
          content={movieForOg ? movieForOg.overview : "TMDB 인기 영화 목록"}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {movieForOg && (
          <>
            <meta property="og:title" content={movieForOg.title} />
            <meta property="og:description" content={movieForOg.overview} />
            <meta property="og:image" content={movieForOg.ogImage} />
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={movieForOg.title} />
            <meta
              property="twitter:description"
              content={movieForOg.overview}
            />
            <meta property="twitter:image" content={movieForOg.ogImage} />
          </>
        )}
      </Head>
      <HomeView initialMovies={initialMovies} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  initialMovies: MovieItem[] | null;
  movieForOg?: { title: string; overview: string; ogImage: string } | null;
}> = async (ctx) => {
  try {
    const res = await moviesApi.getPopular(1);
    const movies = res.data.results ?? null;

    const { movieId } = ctx.query;
    if (typeof movieId === "string") {
      try {
        const detail = await moviesApi.getDetail(Number(movieId));
        const movie = detail.data;
        const proto =
          (ctx.req.headers["x-forwarded-proto"] as string) ?? "http";
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
            initialMovies: movies,
            movieForOg: {
              title: movie.title,
              overview: movie.overview ?? "",
              ogImage,
            },
          },
        };
      } catch {
        // movieId가 유효하지 않으면 기본 홈만 렌더
        return { props: { initialMovies: movies } };
      }
    }

    return { props: { initialMovies: movies } };
  } catch {
    return { props: { initialMovies: null } };
  }
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
