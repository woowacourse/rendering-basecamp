import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__;

performance.mark("beforeRender");

hydrateRoot(
  document.getElementById("root"),
  <App
    initialMovies={initialData.movies ?? []}
    detail={initialData.detail ?? undefined}
  />
);

performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");
