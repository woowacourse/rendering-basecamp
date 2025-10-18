import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { GetServerSideProps } from "next";
import { moviesApi } from "../api/movies";
import { MovieItem } from "../types/Movie.types";
import Head from "next/head";

export interface MovieHomePageProps {
  movies: MovieItem[] | null;
  pageTitle?: string;
}

export default function MovieHomePage({
  movies,
  pageTitle = "MovieList Home",
}: MovieHomePageProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}

export const fetchMoviesForSSR = async () => {
  try {
    const movieDetail = await moviesApi.getPopular();
    return { props: { movies: movieDetail.data.results } };
  } catch {
    return { notFound: true };
  }
};

export const getServerSideProps = async () => {
  const movieDetail = await moviesApi.getPopular();
  return { props: { movies: movieDetail.data.results } };
};
