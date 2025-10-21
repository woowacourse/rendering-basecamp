import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieItem } from "./types/Movie.types";

interface AppProps {
  initialMovies: MovieItem[];
}

function App({ initialMovies }: AppProps) {
  return (
    <OverlayProvider>
      <MovieHomePage initialMovies={initialMovies} />
    </OverlayProvider>
  );
}

export default App;
