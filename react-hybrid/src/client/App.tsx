import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieResponse } from "./types/Movie.types";
import MovieDetailPage from "./pages/MovieDetailPage";
import { MovieDetailResponse } from "./types/MovieDetail.types";

type Props = {
  movieData: MovieResponse;
  movieDetail?: MovieDetailResponse;
  path?: string;
};

function App({ movieData, movieDetail, path }: Props) {
  return (
    <OverlayProvider>
      {path === "/" && <MovieHomePage movieData={movieData} />}
      {path.startsWith("/detail") && (
        <MovieDetailPage popularMovie={movieData} movieDetail={movieDetail} />
      )}
    </OverlayProvider>
  );
}

export default App;
