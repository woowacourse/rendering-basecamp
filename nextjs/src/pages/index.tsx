import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import type { MovieItem } from "@/types/Movie.types";
import type { GetServerSideProps } from "next";
import Head from "next/head";

interface MovieHomePageProps {
  movies: MovieItem[] | null;
}

export default function MovieHomePage({ movies }: MovieHomePageProps) {
  if (!movies) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>Movielist</title>
        <meta name="description" content="인기 영화 목록" />
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
export const getServerSideProps: GetServerSideProps<
  MovieHomePageProps
> = async () => {
  try {
    const res = await moviesApi.getPopular();
    const movies = res.data.results;
    return {
      props: {
        movies,
      },
    };
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return {
      props: {
        movies: null,
      },
    };
  }
};
