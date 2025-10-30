import { moviesApi } from "../../client/api/movies";
import { MovieItem } from "../../client/types/Movie.types";
import { MovieDetailResponse } from "../../client/types/MovieDetail.types";

export const fetchPopularMovies = async (): Promise<MovieItem[]> => {
  const response = await moviesApi.getPopular();
  return response?.data.results ?? [];
};

export const fetchMovieDetailPageData = async (
  movieId: number
): Promise<{
  movies: MovieItem[];
  selectedMovieDetail: MovieDetailResponse;
}> => {
  const [{ data: popularData }, { data: selectedMovieDetail }] =
    await Promise.all([moviesApi.getPopular(), moviesApi.getDetail(movieId)]);

  return {
    movies: popularData.results ?? [],
    selectedMovieDetail,
  };
};
