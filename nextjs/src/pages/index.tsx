import Head from "next/head";
import { moviesApi } from "@/api/movies";
import { InferGetServerSidePropsType } from "next";
import { MovieItem } from "@/types/Movie.types";

import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";

interface MovieHomePageProps {
  movies: MovieItem[] | null;
}

export function MovieHomePage({ movies }: MovieHomePageProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  const res = await moviesApi.getPopular();
  return { props: { movies: res.data.results } };
}

export default function Home({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>영화</title>
        <meta name="google-site-verification" content="" />
        <meta
          name="og:description"
          content="영화 정보 사이트입니다."
          key="home_description"
        />
        <meta property="og:type" content="website" key="home_type" />
        <meta property="og:title" content="movie home" key="home_title" />
        <meta
          property="og:description"
          content="지금 인기 있는 영화를 확인하세요."
          key="og:description"
        />
      </Head>
      <MovieHomePage movies={movies} />
    </>
  );
}
