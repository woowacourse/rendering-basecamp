import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

function App({ initialData }: { initialData: InitialData }) {
  return (
    <OverlayProvider>
      {initialData.page === "home" ? (
        <MovieHomePage movies={initialData.movies} />
      ) : (
        <MovieDetailPage
          movies={initialData.movies}
          movieDetail={initialData.movieDetail ?? null}
        />
      )}
    </OverlayProvider>
  );
}

export default App;
