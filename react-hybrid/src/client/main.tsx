import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { routes } from "./routes";

const { path, props } = window.__INITIAL_DATA__;
const Component = routes.find((route) => route.path === path).component;

performance.mark("beforeHydrate");
hydrateRoot(
  document.getElementById("root"),

  <App Component={Component} props={props} />
);

requestIdleCallback(() => {
  performance.mark("afterHydrate");
  performance.measure("hydration", "beforeHydrate", "afterHydrate");

  const measure = performance.getEntriesByName("hydration")[0];
  console.log(`Hydration이 걸린 시간: ${measure.duration}ms`);
});
