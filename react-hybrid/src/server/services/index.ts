import { moviesApi } from "../../client/api/movies";
import { MovieItem } from "../../client/types/Movie.types";
import { MovieDetailResponse } from "../../client/types/MovieDetail.types";

export async function fetchPopularMovies(): Promise<MovieItem[]> {
  const response = await moviesApi.getPopular();
  return response?.data.results ?? [];
}

export async function fetchMovieDetailPageData(movieId: number): Promise<{
  movies: MovieItem[];
  selectedMovieDetail: MovieDetailResponse;
}> {
  const [{ data: popularData }, { data: selectedMovieDetail }] =
    await Promise.all([moviesApi.getPopular(), moviesApi.getDetail(movieId)]);

  return {
    movies: popularData.results ?? [],
    selectedMovieDetail,
  };
}
