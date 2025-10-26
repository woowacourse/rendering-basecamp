import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__;
console.log("initialData", initialData);

const path = window.location.pathname;
const movieIdMatch = path.match(/\/detail\/(\d+)/);
const movieId = movieIdMatch ? movieIdMatch[1] : undefined;

// Hydration 시작 시점 마킹
performance.mark('beforeRender');

hydrateRoot(
  document.getElementById("root"),
  <App
    movies={initialData.movies}
    url={path}
    movieId={Number(movieId)}
    movieDetail={initialData.movieDetail}
  />
);

// Hydration 종료 시점 마킹
performance.mark('afterHydrate');

// Hydration 소요 시간 측정
performance.measure('hydration', 'beforeRender', 'afterHydrate');
