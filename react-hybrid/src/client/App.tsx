import React from "react";
import { OverlayProvider } from "overlay-kit";
import { Routes, Route } from "react-router-dom";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

function App({
  initialMovies,
  initialDetail,
}: {
  initialMovies: MovieItem[];
  initialDetail?: MovieDetailResponse;
}) {
  return (
    <OverlayProvider>
      <Routes>
        <Route path="/" element={<MovieHomePage movies={initialMovies} />} />
        <Route
          path="/detail/:movieId"
          element={
            <MovieDetailPage
              movies={initialMovies}
              initialDetail={initialDetail}
            />
          }
        />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
