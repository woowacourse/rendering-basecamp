import type { MovieItem, MovieSummary } from "../client/types/Movie.types";
import type { MovieDetail, MovieDetailResponse } from "../client/types/MovieDetail.types";

export const pickMovieSummary = ({
  id,
  title,
  poster_path,
  vote_average,
}: MovieItem): MovieSummary => ({ id, title, poster_path, vote_average });

export const pickMovieDetail = ({
  id,
  title,
  genres,
  overview,
  vote_average,
  poster_path,
}: MovieDetailResponse): MovieDetail => ({
  id,
  title,
  genres,
  overview,
  vote_average,
  poster_path,
});
