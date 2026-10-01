import type { GetServerSideProps } from "next";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { moviesApi } from "../api/movies";
import type { MovieItem } from "../types/Movie.types";

interface Props {
  movies: MovieItem[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const response = await moviesApi.getPopular();
  return { props: { movies: response.data.results } };
};

export default function MovieHomePage({ movies }: Props) {
  if (movies.length === 0) {
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
