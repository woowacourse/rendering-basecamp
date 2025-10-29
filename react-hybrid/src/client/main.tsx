import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { routes } from "../server/routes/routes";

const { initialData } = window.__INITIAL_DATA__;

const pathname = window.location.pathname;

const matchedPath =
  Object.keys(routes)
    .sort((a, b) => b.length - a.length)
    .find((r) => pathname === r || pathname.startsWith(r + "/")) || "/";
const Page = routes[matchedPath];

performance.mark("beforeRender"); // Hydration 시작 시점 기록

hydrateRoot(
  document.getElementById("root"),
  <App Component={Page} initialData={initialData} />
);

performance.mark("afterHydrate"); // Hydration 끝 시점 기록
performance.measure("hydration", "beforeRender", "afterHydrate");
