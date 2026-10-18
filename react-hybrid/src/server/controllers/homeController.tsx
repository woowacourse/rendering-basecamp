import React from "react";
import { renderToString } from "react-dom/server";
import App from "../../client/App";
import { generateHTML } from "../html";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../site";
import { getPopularMovies } from "../tmdb";
import { serverErrorController } from "./errorController";
import type { PageResponse } from "./types";

export const homeController = async (): Promise<PageResponse> => {
  try {
    const movies = await getPopularMovies();

    return {
      status: 200,
      html: generateHTML({
        meta: { title: SITE_NAME, description: SITE_DESCRIPTION, url: SITE_URL },
        body: renderToString(<App movies={movies} />),
        initialData: { movies },
      }),
    };
  } catch (error) {
    return serverErrorController(error);
  }
};
