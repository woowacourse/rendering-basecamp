import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import { moviesApi } from "../api/movies";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import type { MovieItem } from "../types/Movie.types";

export const getServerSideProps = (async () => {
  const response = await moviesApi.getPopular();

  return {
    props: {
      movies: response.data.results,
    },
  };
}) satisfies GetServerSideProps<{ movies: MovieItem[] }>;

export default function Home({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (movies.length === 0) {
    return <p>영화 정보가 없습니다.</p>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}
