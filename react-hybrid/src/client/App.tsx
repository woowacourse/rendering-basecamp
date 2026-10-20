import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import type { MovieItem } from "./types/Movie.types";
import type { MovieDetailResponse } from "./types/MovieDetail.types";

export interface AppProps {
  movies: MovieItem[];
  detailMovie?: MovieDetailResponse | null;
}

function App({ movies, detailMovie = null }: AppProps) {
  return (
    <OverlayProvider>
      {detailMovie ? (
        <MovieDetailPage movies={movies} detailMovie={detailMovie} />
      ) : (
        <MovieHomePage movies={movies} />
      )}
    </OverlayProvider>
  );
}

export default App;
