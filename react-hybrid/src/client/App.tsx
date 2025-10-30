import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieResponse } from "./types/Movie.types";
import MovieDetailPage from "./pages/MovieDetailPage";
import { MovieDetailResponse } from "./types/MovieDetail.types";

type Props = {
  movieData: MovieResponse;
  movieDetail?: MovieDetailResponse;
  currentView?: string;
};

function App({ movieData, movieDetail, currentView }: Props) {
  return (
    <OverlayProvider>
      {currentView === "home" && <MovieHomePage movieData={movieData} />}
      {currentView.startsWith("detail") && (
        <MovieDetailPage popularMovie={movieData} movieDetail={movieDetail} />
      )}
    </OverlayProvider>
  );
}

export default App;
