import Head from "next/head";
import MovieHomePage from "./MovieHomePage";
import type { MovieHomePageProps } from "./MovieHomePage";
import { fetchMoviesForSSR } from "./MovieHomePage";

export default function Home({ movies }: MovieHomePageProps) {
  return (
    <>
      <Head>
        <title>Movie App</title>
        <meta name="description" content="Popular movies collection" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MovieHomePage movies={movies} />
    </>
  );
}
export const getServerSideProps = fetchMoviesForSSR;
