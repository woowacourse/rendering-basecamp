import { moviesApi } from '../../client/api/movies';

export const getMovieDetail = async (id: number) => {
  try {
    const movieDetailResponse = await moviesApi.getDetail(id);
    return movieDetailResponse.data;
  } catch (err) {
    if (err instanceof Error) console.error(err);
    return null;
  }
};
