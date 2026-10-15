import React from "react";
import type { MovieItem } from "./types/Movie.types";
import { MovieList } from "./components/MovieList";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { OverlayProvider } from "overlay-kit";

function App({ movies }: { movies: MovieItem[] }) {
  return (
    <OverlayProvider>
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </OverlayProvider>
  );
}

export default App;
