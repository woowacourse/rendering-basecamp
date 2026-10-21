import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { OverlayProvider } from "overlay-kit";

import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

type Props = {
  movies: MovieItem[];
  movie?: MovieDetailResponse;
};

function App({ movies, movie }: Props) {
  useEffect(() => {
    performance.mark("afterHydrate");
    performance.measure("hydration", "beforeRender", "afterHydrate");

    console.log(performance.getEntriesByName("hydration"));
  }, []);
  return (
    <OverlayProvider>
      <Routes>
        <Route path="/" element={<MovieHomePage movies={movies} />} />
        <Route
          path="/detail/:id"
          element={<MovieDetailPage movies={movies} movie={movie} />}
        />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
