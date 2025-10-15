import type { GetServerSideProps } from "next";
import Head from "next/head";
import { moviesApi } from "../api/movies";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import type { MovieItem } from "../types/Movie.types";

interface HomeProps {
  movies: MovieItem[];
}

export default function Home({ movies }: HomeProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>영화 추천 사이트</title>
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const response = await moviesApi.getPopular();
    const movies = response.data.results;
    return { props: { movies } };
  } catch (error) {
    console.error("영화 정보를 불러오는 데 실패했습니다:", error);
    return { props: { movies: [] } };
  }
};
