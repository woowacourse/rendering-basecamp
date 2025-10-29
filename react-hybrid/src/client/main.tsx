import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

performance.mark("beforeRender");

hydrateRoot(
  document.getElementById("root"),
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");
