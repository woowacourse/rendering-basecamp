import React from "react";
import { OverlayProvider } from "overlay-kit";
import { MovieItem } from "./types/Movie.types";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieDetailResponse } from "./types/MovieDetail.types";
import MovieDetailPage from "./pages/MovieDetailPage";
import { Routes, Route } from "react-router-dom";

interface AppProps {
  initialMovies?: MovieItem[];
  initialMovieDetail?: MovieDetailResponse;
}

function App({ initialMovies, initialMovieDetail }: AppProps) {
  return (
    <OverlayProvider>
      <Routes>
        <Route
          path="/"
          element={<MovieHomePage initialMovies={initialMovies} />}
        />
        <Route
          path="/detail/:id"
          element={<MovieDetailPage initialMovieDetail={initialMovieDetail} />}
        />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
