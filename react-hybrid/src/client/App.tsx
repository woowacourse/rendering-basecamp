import React from "react";
import { OverlayProvider } from "overlay-kit";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

type InitialData = {
  movies?: MovieItem[];
  movie?: MovieDetailResponse;
};

function App({ initialData }: { initialData: InitialData }) {
  return (
    <OverlayProvider>
      <Routes>
        <Route
          path="/"
          element={<MovieHomePage movies={initialData.movies} />}
        />
        <Route
          path="/detail/:movieId"
          element={
            <MovieDetailPage
              movies={initialData.movies}
              movieDetail={initialData.movie}
            />
          }
        />
      </Routes>
    </OverlayProvider>
  );
}
export default App;
