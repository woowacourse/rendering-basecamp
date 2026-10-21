import axios from "axios";
import type { MovieResponse } from "../../client/types/Movie.types";
import type { MovieDetailResponse } from "../../client/types/MovieDetail.types";

// TMDB 토큰은 서버에서만 사용하고, 클라이언트 번들에는 포함하지 않는다.
const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
});

export const tmdbApi = {
  getPopular: async (page: number = 1) => {
    const { data } = await tmdbClient.get<MovieResponse>(
      `/movie/popular?page=${page}&language=ko-KR`
    );
    return data.results;
  },

  getDetail: async (id: number) => {
    const { data } = await tmdbClient.get<MovieDetailResponse>(
      `/movie/${id}?language=ko-KR`
    );
    return data;
  },
} as const;
