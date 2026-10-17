import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { readInitialData } from "./initialData";

hydrateRoot(document.getElementById("root"), <App page={readInitialData()} />);
