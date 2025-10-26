import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const { routeType, initialData } = window.__INITIAL_DATA__;

performance.mark("beforeRender"); // Hydration 시작 시점 기록

hydrateRoot(
  document.getElementById("root"),
  <App routeType={routeType} initialData={initialData} />
);

performance.mark("afterHydrate"); // Hydration 끝 시점 기록
performance.measure("hydration", "beforeRender", "afterHydrate");
