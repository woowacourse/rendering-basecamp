import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__;
console.log("initialData", initialData);

const rootElement = document.getElementById("root");
if (rootElement) {
  const url = initialData?.url || window.location.pathname;
  hydrateRoot(rootElement, <App url={url} />);
}
