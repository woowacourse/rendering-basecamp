import React from "react";
import { Routes, Route } from "react-router-dom";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

interface AppProps {
  initialMovies?: MovieItem[];
  movieDetail?: MovieDetailResponse;
}

function App({ initialMovies, movieDetail }: AppProps) {
  return (
    <OverlayProvider>
      <Routes>
        <Route
          path="/"
          element={<MovieHomePage initialMovies={initialMovies} />}
        />
        <Route
          path="/detail/:id"
          element={
            <MovieDetailPage
              initialMovies={initialMovies}
              movieDetail={movieDetail}
            />
          }
        />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
