import axios from "axios";

const serverApiClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
});

export const serverMoviesApi = {
  /**
   * 인기 영화 목록 조회
   */
  getPopular: (page: number = 1) =>
    serverApiClient.get(`/movie/popular?page=${page}&language=ko-KR`),
  /**
   * 영화 상세 정보 조회
   */
  getDetail: (id: number) => serverApiClient.get(`/movie/${id}?language=ko-KR`),
} as const;
