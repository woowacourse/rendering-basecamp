import React from "react";
import { hydrateRoot } from "react-dom/client";
import { OverlayProvider } from "overlay-kit";
import App from "./App";

const initialData = window.__INITIAL_DATA__;

performance.mark("beforeRender");

hydrateRoot(
  document.getElementById("root"),
  <OverlayProvider>
    <App movies={initialData?.movies} detailMovie={initialData?.detailMovie} />
  </OverlayProvider>
);

performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");

console.log("[Hydration] Completed");
