import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__ ?? { movies: [] };

performance.mark("beforeRender");
hydrateRoot(
    document.getElementById("root")!,
    <App initialMovies={initialData.movies} />
);
performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");