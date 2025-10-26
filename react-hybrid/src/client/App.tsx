import React from "react";
import { OverlayProvider } from "overlay-kit";
import { MovieItem } from "./types/Movie.types";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { MovieDetailResponse } from "./types/MovieDetail.types";

interface AppProps {
  routeType: "home" | "detail";
  initialData: {
    movies: MovieItem[];
    detail?: MovieDetailResponse;
  };
}

function App({ routeType, initialData }: AppProps) {
  return (
    <OverlayProvider>
      {routeType === "home" && <MovieHomePage movies={initialData.movies} />}
      {routeType === "detail" && (
        <MovieDetailPage
          movies={initialData.movies}
          movieItem={initialData.detail}
        />
      )}
    </OverlayProvider>
  );
}

export default App;
