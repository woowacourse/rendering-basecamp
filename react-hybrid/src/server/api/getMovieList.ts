import { moviesApi } from '../../client/api/movies';

export const getMovieList = async () => {
  try {
    const movieListResponse = await moviesApi.getPopular();
    return movieListResponse.data.results;
  } catch (err) {
    if (err instanceof Error) console.error(err);
    return [];
  }
};
