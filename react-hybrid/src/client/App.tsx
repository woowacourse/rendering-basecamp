import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import { InitialData } from "./types/global";
import MovieDetailPage from "./pages/MovieDetailPage";

type Page = "home" | "detail";
interface AppProps {
  initialData: InitialData;
  page?: Page;
}

function App({ initialData, page = "home" }: AppProps) {
  return (
    <OverlayProvider>
      {page === "home" && (
        <MovieHomePage moviesServerData={initialData.movies} />
      )}
      {page === "detail" && (
        <MovieDetailPage
          moviesServerData={initialData.movies}
          movie={initialData.movie}
        />
      )}
    </OverlayProvider>
  );
}

export default App;
