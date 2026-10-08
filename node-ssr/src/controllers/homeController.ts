import { moviesApi } from "../service/tmdbApi";
import { homePage } from "../views/pages";
import { serverErrorController } from "./errorController";
import { PageResponse } from "./types";

export const homeController = async (): Promise<PageResponse> => {
  try {
    const { results } = await moviesApi.getPopular();
    return { status: 200, html: homePage(results) };
  } catch (error) {
    return serverErrorController(error);
  }
};
