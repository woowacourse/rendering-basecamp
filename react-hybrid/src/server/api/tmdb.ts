import axios, { isAxiosError } from "axios";
import type { MovieResponse } from "../../client/types/Movie.types";
import type { MovieDetailResponse } from "../../client/types/MovieDetail.types";

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
});

export const tmdbApi = {
  getPopularMovies: async (page: number = 1) => {
    const { data } = await tmdbClient.get<MovieResponse>(
      `/movie/popular?page=${page}&language=ko-KR`
    );
    return data.results;
  },

  /**
   * 영화 상세 정보 조회. TMDB에 없는 영화면 null
   */
  findMovieDetail: async (id: number) => {
    try {
      const { data } = await tmdbClient.get<MovieDetailResponse>(
        `/movie/${id}?language=ko-KR`
      );
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
} as const;
