import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const initialData = window.__INITIAL_DATA__;
console.log("initialData", initialData);

performance.mark("beforeHydrate");
hydrateRoot(
  document.getElementById("root"),
  <BrowserRouter>
    <App initialMovies={initialData?.movies} />
  </BrowserRouter>
);
performance.mark("afterHydrate");
performance.measure("hydration", "beforeHydrate", "afterHydrate");
