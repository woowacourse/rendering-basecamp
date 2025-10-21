import React from "react";
import { OverlayProvider } from "overlay-kit";
import { MovieItem } from "./types/Movie.types";

function App({ movies }: { movies: MovieItem[] }) {
  return <OverlayProvider>App</OverlayProvider>;
}

export default App;
