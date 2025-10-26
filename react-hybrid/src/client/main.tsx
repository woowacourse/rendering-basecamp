import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialMovies = window.__INITIAL_DATA__;

console.log("initialMovies", initialMovies);

hydrateRoot(
  document.getElementById("root"),
  <App
    initialMovies={initialMovies.movies}
    detailMovie={initialMovies.detailMovie}
  />
);
