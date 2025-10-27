import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__;

performance.mark("beforeRender");

hydrateRoot(
  document.getElementById("root"),
  <App
    movies={initialData?.movies || []}
    movieDetail={initialData?.detail}
    movieId={initialData?.detail?.id}
    initialPath={window.location.pathname}
  />
);

performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");
