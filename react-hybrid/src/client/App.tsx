import React from "react";
import { OverlayProvider } from "overlay-kit";
import { MovieItem } from "./types/Movie.types";
import MovieHomePage from "./pages/MovieHomePage";

interface AppProps {
  initialData?: {
    movies: MovieItem[];
  };
}

function App({initialData}: AppProps) {
  return (
      <OverlayProvider>
        <MovieHomePage initialMovies={initialData?.movies} />
      </OverlayProvider>
    );
}


export default App;
