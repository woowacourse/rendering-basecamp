import MovieHomePage from "@/components/MovieHomePage";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>영화 리뷰</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MovieHomePage />
    </>
  );
}
