import axios from "axios";
import { MovieDetailResponse, MovieResponse } from "./types";

export const BASE_URL = "https://api.themoviedb.org/3";

// 환경변수에서 TMDB API 토큰 가져오기
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

if (!TMDB_ACCESS_TOKEN) {
  console.warn("TMDB_ACCESS_TOKEN 환경변수가 설정되지 않았습니다.");
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
  },
});

export const moviesApi = {
  /**
   * 인기 영화 목록 조회
   */
  getPopular: async (page: number = 1) => {
    const response = await apiClient.get<MovieResponse>(
      `/movie/popular?page=${page}&language=ko-KR`
    );
    return response.data;
  },

  /**
   * 영화 상세 정보 조회
   */
  getDetail: async (id: number) => {
    const response = await apiClient.get<MovieDetailResponse>(
      `/movie/${id}?language=ko-KR`
    );
    return response.data;
  },
} as const;
