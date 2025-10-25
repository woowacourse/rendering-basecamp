import React from "react";
import { OverlayProvider } from "overlay-kit";
import { MovieItem } from "./types/Movie.types";

function App({ movies }: { movies: MovieItem[] }) {
  console.log(movies);
  return <OverlayProvider>aa</OverlayProvider>;
}

export default App;
