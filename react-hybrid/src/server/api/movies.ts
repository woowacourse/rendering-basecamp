import type { MovieResponse } from "../../client/types/Movie.types";
import type { MovieDetailResponse } from "../../client/types/MovieDetail.types";

const BASE_URL = "https://api.themoviedb.org/3";

const createHeaders = () => {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN이 설정되지 않았습니다.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getPopularMovies = async (page = 1): Promise<MovieResponse> => {
  const endpoint = `${BASE_URL}/movie/popular?page=${page}&language=ko-KR`;

  const response = await fetch(endpoint, { headers: createHeaders() });
  const data = await response.json();
  return data;
};

export const getMovieDetail = async (
  id: number,
): Promise<MovieDetailResponse> => {
  const endpoint = `${BASE_URL}/movie/${id}?language=ko-KR`;

  const response = await fetch(endpoint, { headers: createHeaders() });
  const data = await response.json();
  return data;
};
