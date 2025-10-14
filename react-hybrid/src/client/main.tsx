import React from "react";
import { hydrateRoot } from "react-dom/client";
import App, { Page } from "./App";

const initialData = window.__INITIAL_DATA__;

const page = window.location.pathname.split("/")[1] as Page;

hydrateRoot(
  document.getElementById("root"),
  <App initialData={initialData} page={page} />
);
