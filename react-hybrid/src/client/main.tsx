import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("root 요소를 찾을 수 없습니다.");
}

const initialData = window.__INITIAL_DATA__;

performance.mark("beforeHydrate");

hydrateRoot(
  root,
  <BrowserRouter>
    <App movies={initialData.movies} movie={initialData.movie} />
  </BrowserRouter>,
);

performance.mark("afterHydrate");
performance.measure("hydration", "beforeHydrate", "afterHydrate");

console.log("hydration 완료");
