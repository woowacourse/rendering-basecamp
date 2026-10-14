import { hydrateRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");

if (root == null) {
  throw new Error("root element를 찾을 수 없습니다.");
}

const initialData = window.__INITIAL_DATA__;

hydrateRoot(root, <App movies={initialData.movies} />);
