import React from "react";
import { OverlayProvider } from "overlay-kit";

import MovieHomePage from "./pages/MovieHomePage";
import { MovieItem } from "./types/Movie.types";

type Props = {
  movies: MovieItem[];
};

function App({ movies }: Props) {
  return (
    <OverlayProvider>
      <MovieHomePage movies={movies} />
    </OverlayProvider>
  );
}

export default App;
