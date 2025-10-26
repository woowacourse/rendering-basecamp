import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__ ?? null;
console.log("initialData from server:", initialData);

const container = document.getElementById("root");

hydrateRoot(container as HTMLElement, <App initialData={initialData} />);
