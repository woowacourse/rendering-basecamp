import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { InitialDataContext } from "./contexts/InitialDataContext";

const initialData = window.__INITIAL_DATA__;
console.log("initialData", initialData);

performance.mark("beforeRender");
hydrateRoot(
  document.getElementById("root"),
  <InitialDataContext.Provider value={initialData}>
    <App />
  </InitialDataContext.Provider>
);
performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");
