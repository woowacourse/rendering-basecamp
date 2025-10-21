import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const { routeType, initialData } = window.__INITIAL_DATA__;

hydrateRoot(
  document.getElementById("root"),
  <App routeType={routeType} initialData={initialData} />
);
