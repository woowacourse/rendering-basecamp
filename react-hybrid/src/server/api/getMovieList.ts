import { moviesApi } from '../../client/api/movies';
import { MovieItem } from '../../client/types/Movie.types';

export const getMovieList = async () => {
  try {
    const movieListResponse = await moviesApi.getPopular();
    return movieListResponse.data.results as MovieItem[];
  } catch (err) {
    if (err instanceof Error) console.error(err);
    return [];
  }
};
