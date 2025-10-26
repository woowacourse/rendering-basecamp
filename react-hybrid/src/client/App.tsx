import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieResponse } from "./types/Movie.types";
import MovieDetailPage from "./pages/MovieDetailPage";
import { MovieDetailResponse } from "./types/MovieDetail.types";

type Props = {
  movieData: MovieResponse;
  movieDetail?: MovieDetailResponse;
};

function App({ movieData, movieDetail }: Props) {
  return (
    <OverlayProvider>
      {/* <MovieHomePage movieData={movieData} /> */}
      <MovieDetailPage popularMovie={movieData} movieDetail={movieDetail} />
    </OverlayProvider>
  );
}

export default App;
