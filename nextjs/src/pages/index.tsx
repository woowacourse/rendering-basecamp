import Head from "next/head";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import HomeView from "../components/HomeView";
import { moviesApi } from "../api/movies";
import type { MovieItem } from "../types/Movie.types";
import type { NextPageWithLayout } from "./_app";
import type { ReactElement } from "react";
import Layout from "../components/Layout";

const Home: NextPageWithLayout<{ initialMovies: MovieItem[] | null }> = ({
  initialMovies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>인기 영화</title>
        <meta name="description" content="TMDB 인기 영화 목록" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeView initialMovies={initialMovies} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  initialMovies: MovieItem[] | null;
}> = async () => {
  try {
    const res = await moviesApi.getPopular(1);
    const movies = res.data.results ?? null;
    return { props: { initialMovies: movies } };
  } catch {
    return { props: { initialMovies: null } };
  }
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
