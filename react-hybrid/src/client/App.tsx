import React from "react";
import { OverlayProvider } from "overlay-kit";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

interface AppProps {
  Component: React.ComponentType<{
    movies: MovieItem[];
    detail?: MovieDetailResponse;
  }>;
  initialData: {
    movies: MovieItem[];
    detail?: MovieDetailResponse;
  };
}

function App({ Component, initialData }: AppProps) {
  return (
    <OverlayProvider>
      <Component {...initialData} />
    </OverlayProvider>
  );
}

export default App;
