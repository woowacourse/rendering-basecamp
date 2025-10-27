import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const initialData = (window as any).__INITIAL_DATA__;
console.log("initialData", initialData);

hydrateRoot(
  document.getElementById("root")!,
  <BrowserRouter>
    <App
      initialMovies={initialData?.movies || []}
      initialDetail={initialData?.detail}
    />
  </BrowserRouter>
);
