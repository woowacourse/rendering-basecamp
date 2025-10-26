import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const { movies, movieDetail, path } = window.__INITIAL_DATA__;

hydrateRoot(
  document.getElementById("root"),
  <App path={path} movies={movies} movieDetail={movieDetail} />
);
