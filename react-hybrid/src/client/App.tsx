import React, { Activity } from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { InitialMovieData } from "./types/global";

type Props = {
  path: "/" | "/movies/:id";
  initialData: InitialMovieData;
};

function App({ path, initialData }: Props) {
  return (
    <OverlayProvider>
      <Activity mode={path === "/" ? "visible" : "hidden"}>
        <MovieHomePage movies={initialData.movies} />
      </Activity>
      <Activity mode={path.startsWith("/movies/") ? "visible" : "hidden"}>
        <MovieDetailPage initialData={initialData} />
      </Activity>
    </OverlayProvider>
  );
}

export default App;
