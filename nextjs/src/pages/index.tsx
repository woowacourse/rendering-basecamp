import Head from "next/head";
import { GetServerSideProps } from "next";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { moviesApi } from "../api/movies";
import { MovieItem } from "../types/Movie.types";

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
        <title>영화 리뷰 - 인기 영화</title>
        <meta
          name="description"
          content="최신 인기 영화를 확인하고 리뷰를 남겨보세요"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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

    return {
      props: {
        movies,
      },
    };
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return {
      props: {
        movies: [],
      },
    };
  }
};
