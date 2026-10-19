import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { OverlayProvider } from "overlay-kit";

import MovieHomePage from "./pages/MovieHomePage";
import { MovieItem } from "./types/Movie.types";

type Props = {
  movies: MovieItem[];
};

function App({ movies }: Props) {
  useEffect(() => {
    performance.mark("afterHydrate");
    performance.measure("hydration", "beforeRender", "afterHydrate");

    console.log(performance.getEntriesByName("hydration"));
  }, []);
  return (
    <OverlayProvider>
      <Routes>
        <Route path="/" element={<MovieHomePage movies={movies} />} />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
