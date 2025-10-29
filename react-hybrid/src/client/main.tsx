import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { MovieResponse } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

const initialData = window.__INITIAL_DATA__ as unknown as {
  movies: MovieResponse;
  movieDetail: MovieDetailResponse;
};

hydrateRoot(
  document.getElementById("root"),
  <App
    movieData={initialData.movies}
    movieDetail={initialData.movieDetail}
    path={window.location.pathname}
  />
);
