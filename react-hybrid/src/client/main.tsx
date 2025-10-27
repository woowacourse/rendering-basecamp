import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__;

performance.mark("hydration-start");

hydrateRoot(
  document.getElementById("root"),
  <App
    initialMovies={initialData.movies ?? []}
    detail={initialData.detail ?? undefined}
  />
);

requestIdleCallback(() => {
  performance.mark("hydration-end");
  performance.measure("hydration", "hydration-start", "hydration-end");

  const measure = performance.getEntriesByName("hydration")[0];
  console.log(`Hydration took ${measure.duration}ms`);
});
