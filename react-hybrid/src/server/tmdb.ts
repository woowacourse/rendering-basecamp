import axios from "axios";
import { cached } from "./cache";
import type { MovieItem, MovieResponse } from "../client/types/Movie.types";
import type { MovieDetailResponse } from "../client/types/MovieDetail.types";

const CACHE_TTL_MS = 60 * 60 * 1000;

// 토큰은 서버에서만 사용한다. 브라우저는 /api/movies/:id를 거쳐 상세 정보를 받는다.
const tmdbClient = axios.create({ baseURL: "https://api.themoviedb.org/3" });
tmdbClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  return config;
});

export const getPopularMovies = (): Promise<MovieItem[]> =>
  cached("popular:1", CACHE_TTL_MS, async () => {
    const { data } = await tmdbClient.get<MovieResponse>("/movie/popular?page=1&language=ko-KR");
    return data.results;
  });

export const getMovieDetail = (id: number): Promise<MovieDetailResponse> =>
  cached(`detail:${id}`, CACHE_TTL_MS, async () => {
    const { data } = await tmdbClient.get<MovieDetailResponse>(`/movie/${id}?language=ko-KR`);
    return data;
  });
