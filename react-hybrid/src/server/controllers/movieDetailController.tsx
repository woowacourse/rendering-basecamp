import React from "react";
import { renderToString } from "react-dom/server";
import { isAxiosError } from "axios";
import App from "../../client/App";
import { generateHTML } from "../html";
import { SITE_NAME, SITE_URL } from "../site";
import { getMovieDetail, getPopularMovies } from "../tmdb";
import { notFoundController, serverErrorController } from "./errorController";
import type { PageResponse } from "./types";

export const parseMovieId = (rawId: string) => {
  const movieId = Number(rawId);
  return Number.isInteger(movieId) && movieId > 0 ? movieId : null;
};

export const movieDetailController = async (rawId: string): Promise<PageResponse> => {
  const movieId = parseMovieId(rawId);
  if (movieId === null) {
    return notFoundController();
  }

  try {
    const [movies, movieDetail] = await Promise.all([
      getPopularMovies(),
      getMovieDetail(movieId),
    ]);

    return {
      status: 200,
      html: generateHTML({
        meta: {
          title: `${movieDetail.title} | ${SITE_NAME}`,
          description: movieDetail.overview || `${movieDetail.title} 상세 정보`,
          url: `${SITE_URL}/detail/${movieDetail.id}`,
          image: movieDetail.poster_path
            ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
            : undefined,
        },
        body: renderToString(<App movies={movies} movieDetail={movieDetail} />),
        initialData: { movies, movieDetail },
      }),
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return notFoundController();
    }
    return serverErrorController(error);
  }
};
