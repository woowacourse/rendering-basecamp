import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import type { InitialData } from "./types/InitialData.types";

function App({ movies, movieDetail }: InitialData) {
  return (
    <OverlayProvider>
      {movieDetail ? (
        <MovieDetailPage movies={movies} movieDetail={movieDetail} />
      ) : (
        <MovieHomePage movies={movies} />
      )}
    </OverlayProvider>
  );
}

export default App;
