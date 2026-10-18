import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const { movies, movieDetail } = window.__INITIAL_DATA__;

performance.mark("beforeRender");
hydrateRoot(
  document.getElementById("root"),
  <App movies={movies} movieDetail={movieDetail} />
);
performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");
