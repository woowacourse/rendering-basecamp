import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialMovies = window.__INITIAL_DATA__
  ? {
      movies: window.__INITIAL_DATA__.movies,
      details: window.__INITIAL_DATA__.detail ?? null,
    }
  : undefined;

performance.mark("hydration-start");

hydrateRoot(
  document.getElementById("root"),
  <App initialMovies={initialMovies} />
);

performance.mark("hydration-end");
performance.measure("hydration", "hydration-start", "hydration-end");
