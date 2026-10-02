import { moviesApi } from "@/api/movies";
import MovieHomePage from "@/components/MovieHomePage";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

export const getServerSideProps = (async () => {
  try {
    const response = await moviesApi.getPopular();
    return { props: { movies: response.data.results } };
  } catch {
    return { props: { movies: [] } };
  }
}) satisfies GetServerSideProps<{ movies: MovieItem[] }>;

export default function Home({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>영화 리뷰</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MovieHomePage movies={movies} />
    </>
  );
}
