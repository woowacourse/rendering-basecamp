import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__;
const root = document.getElementById("root");

if (!root) {
  throw new Error("root 요소를 찾을 수 없습니다.");
}

hydrateRoot(
  document.getElementById("root"),
  <App movies={initialData.movies} />,
);
