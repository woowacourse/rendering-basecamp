import { isAxiosError } from "axios";
import { moviesApi } from "../service/tmdbApi";
import { detailPage } from "../views/pages";
import { notFoundController, serverErrorController } from "./errorController";
import { PageResponse } from "./types";

export const movieDetailController = async (
  rawId: string
): Promise<PageResponse> => {
  const movieId = Number(rawId);
  if (!Number.isInteger(movieId) || movieId <= 0) {
    return notFoundController();
  }

  try {
    const [popular, movie] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);
    return { status: 200, html: detailPage(popular.results, movie) };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return notFoundController();
    }
    return serverErrorController(error);
  }
};
