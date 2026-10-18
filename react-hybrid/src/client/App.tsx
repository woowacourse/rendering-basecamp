import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import type { MovieItem } from "./types/Movie.types";

interface AppProps {
  movies: MovieItem[];
}

function App({ movies }: AppProps) {
  return (
    <OverlayProvider>
      <MovieHomePage movies={movies} />
    </OverlayProvider>
  );
}

export default App;
