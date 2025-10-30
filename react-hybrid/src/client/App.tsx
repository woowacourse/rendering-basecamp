import React from "react";
import MovieDetailPage from "./pages/MovieDetailPage";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

interface AppProps {
  movies?: MovieItem[];
  detailMovie?: MovieDetailResponse;
}

function App({ movies, detailMovie }: AppProps) {
  const isDetailPage = window.location.pathname.startsWith("/detail/");

  return (
    <>
      {isDetailPage ? (
        <MovieDetailPage movies={movies} detailMovie={detailMovie} />
      ) : (
        <MovieHomePage movies={movies} />
      )}
    </>
  );
}

export default App;
