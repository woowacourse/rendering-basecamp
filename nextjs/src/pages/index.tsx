import type { GetServerSideProps } from "next";
import type { MovieItem } from "../types/Movie.types";
import { moviesApi } from "../api/movies";
import MovieHomePage from "../screens/MovieHomePage";

type HomeProps = {
  movies: MovieItem[];
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await moviesApi.getPopular();

  return {
    props: {
      movies: response.data.results,
    },
  };
};

export default function Home({ movies }: HomeProps) {
  if (movies.length === 0) {
    return <p>영화 정보가 없습니다.</p>;
  }

  return <MovieHomePage movies={movies} />;
}
