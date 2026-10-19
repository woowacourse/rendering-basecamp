import React from "react";
import { Route, Routes } from "react-router-dom";

import { OverlayProvider } from "overlay-kit";

import MovieHomePage from "./pages/MovieHomePage";
import { MovieItem } from "./types/Movie.types";

type Props = {
  movies: MovieItem[];
};

function App({ movies }: Props) {
  return (
    <OverlayProvider>
      <Routes>
        <Route path="/" element={<MovieHomePage movies={movies} />} />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
