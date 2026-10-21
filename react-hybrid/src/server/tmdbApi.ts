import axios from "axios";
import type { MovieResponse } from "../client/types/Movie.types";
import type { MovieDetailResponse } from "../client/types/MovieDetail.types";

/**
 * TMDB를 호출하는 서버 전용 클라이언트.
 * 토큰은 서버에만 두고, 브라우저 코드에서는 이 파일을 import하지 않는다.
 */
const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
});

export const tmdbApi = {
  getPopular: async (page: number = 1) => {
    const response = await tmdbClient.get<MovieResponse>(
      `/movie/popular?page=${page}&language=ko-KR`
    );
    return response.data;
  },

  getDetail: async (id: number) => {
    const response = await tmdbClient.get<MovieDetailResponse>(
      `/movie/${id}?language=ko-KR`
    );
    return response.data;
  },
} as const;
