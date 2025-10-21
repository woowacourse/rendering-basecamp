import React from "react";
import { OverlayProvider } from "overlay-kit";
import { MovieItem } from "./types/Movie.types";
import MovieHomePage from "./pages/MovieHomePage";

function App({ movies }: { movies: MovieItem[] }) {
  return (
    <OverlayProvider>
      <MovieHomePage movies={movies} />
    </OverlayProvider>
  );
}

export default App;
