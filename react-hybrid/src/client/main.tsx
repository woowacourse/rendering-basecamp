import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { routes } from "./routes";

const { path, props } = window.__INITIAL_DATA__;
const Component = routes.find((route) => route.path === path).component;

hydrateRoot(
  document.getElementById("root"),
  <App Component={Component} props={props} />
);
