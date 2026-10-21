import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__;
const root = document.getElementById("root");

if (!root) {
  throw new Error("root 요소를 찾을 수 없습니다.");
}

performance.mark("beforeRender");
hydrateRoot(root, <App {...initialData} />);
