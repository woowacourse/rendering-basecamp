import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePageSSR from "./pages/MovieHomePageSSR";
import type { MovieItem } from "./types/Movie.types";

function App() {
  const initialData = typeof window !== 'undefined' ? window.__INITIAL_DATA__ : { movies: [] };
  const movies = initialData?.movies || [];

  return (
    <OverlayProvider>
      <MovieHomePageSSR movies={movies as MovieItem[]} />
    </OverlayProvider>
  );
}

export default App;
