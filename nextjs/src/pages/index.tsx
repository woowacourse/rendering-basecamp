import Head from "next/head";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { moviesApi } from "../api/movies";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { MovieItemType } from "../types/Movie.types";

type Props = {
  movies: MovieItemType[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const res = await moviesApi.getPopular();
    const movies = res.data.results;
    return { props: { movies } };
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return { props: { movies: [] } };
  }
};

export default function MovieHomePage({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Movie Home</title>
        <meta
          name="description"
          content="Popular movies fetched from the Movie API"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div id="wrap">
        {movies.length === 0 ? (
          <div>영화 정보를 불러오는데 실패했습니다.</div>
        ) : (
          <>
            <Header featuredMovie={movies[0]} />
            <MovieList movies={movies} />
            <Footer />
          </>
        )}
      </div>
    </>
  );
}
