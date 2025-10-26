import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialMovies = window.__INITIAL_DATA__
  ? {
      movies: window.__INITIAL_DATA__.movies,
      details: window.__INITIAL_DATA__.detail ?? null,
    }
  : undefined;

hydrateRoot(
  document.getElementById("root"),
  <App initialMovies={initialMovies} />
);
