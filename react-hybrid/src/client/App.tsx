import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieResponse } from "./types/Movie.types";

function App({ movieData }: { movieData: MovieResponse }) {
  return (
    <OverlayProvider>
      <MovieHomePage movieData={movieData} />
    </OverlayProvider>
  );
}

export default App;
