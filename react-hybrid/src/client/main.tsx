import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__;
console.log("initialData", initialData);

const path = window.location.pathname;
const movieIdMatch = path.match(/\/detail\/(\d+)/);
const movieId = movieIdMatch ? movieIdMatch[1] : undefined;

hydrateRoot(
  document.getElementById("root"),
  <App
    movies={initialData.movies}
    url={path}
    movieId={Number(movieId)}
    movieDetail={initialData.movieDetail}
  />
);
