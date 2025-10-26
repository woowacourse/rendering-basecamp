import React from "react";
import { OverlayProvider } from "overlay-kit";
import type { MovieItem } from "./types/Movie.types";
import type { MovieDetailResponse } from "./types/MovieDetail.types";

function App({
  routeType,
  initialData,
}: {
  routeType: "home" | "detail";
  initialData: {
    movies: MovieItem[];
    selectedMovieDetail?: MovieDetailResponse;
  };
}) {
  return <OverlayProvider>App</OverlayProvider>;
}

export default App;
