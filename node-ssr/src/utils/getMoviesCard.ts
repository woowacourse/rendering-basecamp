import MovieCard from "../components/MovieCard";
import { Movie, MovieResponse } from "../service/types";

interface GetMoviesCardParams {
  movieList: MovieResponse;
}

async function getMoviesCard({ movieList }: GetMoviesCardParams) {
  return movieList.results.map((movie: Movie) => MovieCard({ movie })).join("");
}

export { getMoviesCard };
