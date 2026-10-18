import { moviesApi } from "../client/api/movies";
import { cached } from "./cache";

const POPULAR_TTL_MS = 60 * 60 * 1000;

export const getPopularMovies = () =>
  cached("popular:1", POPULAR_TTL_MS, async () => {
    const { data } = await moviesApi.getPopular();
    return data.results;
  });
