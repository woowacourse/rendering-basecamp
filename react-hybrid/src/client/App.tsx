import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import type { InitialData } from "./types/InitialData";

function App({ initialData }: { initialData: InitialData }) {
  return (
    <OverlayProvider>
      {initialData.page === 'detail' ? (
        <MovieDetailPage
          movies={initialData.movies}
          movieDetail={initialData.movieDetail}
        />
      ) : (
        <MovieHomePage initialMovies={initialData.movies} />
      )}
    </OverlayProvider>
  );
}

export default App;
