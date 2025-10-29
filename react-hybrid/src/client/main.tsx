import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const initialData = (window as any).__INITIAL_DATA__;
console.log("initialData", initialData);

performance.mark("beforeRender");
console.log("beforeRender", performance.now());

hydrateRoot(
  document.getElementById("root")!,
  <BrowserRouter>
    <App
      initialMovies={initialData?.movies || []}
      initialDetail={initialData?.detail}
    />
  </BrowserRouter>
);

performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");
console.log("afterHydrate", performance.now());

const hydrationDuration =
  performance.getEntriesByName("afterHydrate")[0].startTime -
  performance.getEntriesByName("beforeRender")[0].startTime;
console.log("hydration duration:", hydrationDuration, "ms");
