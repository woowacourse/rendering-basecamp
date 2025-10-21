import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { MovieResponse } from "./types/Movie.types";

const initialData = window.__INITIAL_DATA__ as unknown as {
  movies: MovieResponse;
};

console.log("initialData", initialData.movies);

hydrateRoot(
  document.getElementById("root"),
  <App movieData={initialData.movies} />
);
