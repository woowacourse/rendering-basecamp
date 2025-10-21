import React from "react";
import { OverlayProvider } from "overlay-kit";
import type { MovieItem } from "./types/Movie.types";
import MovieHomePage from "./pages/MovieHomePage";

interface AppProps {
  initialMovies?: MovieItem[];
}

function App({ initialMovies }: AppProps) {
  return (
    <OverlayProvider>
      <MovieHomePage initialMovies={initialMovies} />
    </OverlayProvider>
  );
}

export default App;
