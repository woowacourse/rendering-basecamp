import React from "react";
import {OverlayProvider} from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import {MovieItem} from "./types/Movie.types";

interface AppProps {
  url?: string;
  movies: MovieItem[];
  movieId?: number;
}

function App({url = "/", movies, movieId}: AppProps) {
  const isDetailPage = url.startsWith("/detail/");

  return (
    <OverlayProvider>
      {isDetailPage && movieId ?
        <MovieDetailPage movies={movies} movieId={movieId}/>
        :
        <MovieHomePage movies={movies}/>
      }
    </OverlayProvider>
  );
}

export default App;
