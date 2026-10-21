import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { HydrationMarker } from "./HydrationMarker";
import { readInitialData } from "./initialData";

const page = readInitialData();

performance.mark("beforeRender");
hydrateRoot(
  document.getElementById("root"),
  <HydrationMarker>
    <App page={page} />
  </HydrationMarker>
);
performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");
