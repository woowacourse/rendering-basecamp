import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

export const getServerSideProps = (async () => {
  const moviesRes = await moviesApi.getPopular();
  const movies: MovieItem[] = moviesRes.data.results;

  return { props: { movies } };
}) satisfies GetServerSideProps<{
  movies: MovieItem[];
}>;

export default function Home({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>세라의 영화 앱</title>
        <meta property="og:title" content="세라의 영화 앱" key="title" />
        <meta
          property="og:description"
          content="지금 인기 있는 영화를 확인하세요"
          key="description"
        />
        <meta
          property="og:url"
          content={process.env.NEXT_PUBLIC_APP_URL}
          key="url"
        />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
