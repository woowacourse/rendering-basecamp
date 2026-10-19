import React from "react";
import { BrowserRouter } from "react-router-dom";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__;
console.log("initialData", initialData);

hydrateRoot(
  document.getElementById("root"),
  <BrowserRouter>
    <App {...initialData} />
  </BrowserRouter>,
);
