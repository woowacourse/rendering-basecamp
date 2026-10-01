import type { GetServerSideProps } from "next";
import { MovieHome } from "../components/MovieHome";
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
  return <MovieHome movies={movies} />;
}
