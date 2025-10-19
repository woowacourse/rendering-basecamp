import TopRatedMovieCard from "../components/TopRatedMovieCard";
import { MovieResponse } from "../service/types";

interface GetTopRatedMovieCardParams {
  movieList: MovieResponse;
}

export default function getTopRatedMovieCard({
  movieList,
}: GetTopRatedMovieCardParams) {
  const topRatedMovie = movieList.results.reduce((prev, current) => {
    return prev.vote_average > current.vote_average ? prev : current;
  });

  return TopRatedMovieCard({ topRatedMovie });
}
