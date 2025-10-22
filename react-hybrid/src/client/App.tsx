import React from "react";
import { OverlayProvider } from "overlay-kit";
import type { MovieItem } from "./types/Movie.types";
import MovieHomePage from './pages/MovieHomePage';

function App() {
  const initialData = typeof window !== 'undefined' ? window.__INITIAL_DATA__ : { movies: [] };
  const movies = initialData?.movies || [];

  return (
    <OverlayProvider>
      <MovieHomePage movies={movies as MovieItem[]} />
    </OverlayProvider>
  );
}

export default App;
