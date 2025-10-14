import Head from "next/head";
import MovieHomePage from "./MovieHomePage";

export default function Home() {
  return (
    <>
      <Head>
        <title>인기 영화</title>
        <meta name="description" content="TMDB 인기 영화 목록" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MovieHomePage />
    </>
  );
}
