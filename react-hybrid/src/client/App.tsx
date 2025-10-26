import React from "react";
import {OverlayProvider} from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import {MovieItem} from "./types/Movie.types";
import {MovieDetailResponse} from "./types/MovieDetail.types";

interface AppProps {
  url?: string;
  movies: MovieItem[];
  movieId?: number;
  movieDetail?: MovieDetailResponse;
}

function App({url = "/", movies, movieId, movieDetail}: AppProps) {
  const isDetailPage = url.startsWith("/detail/");

  return (
    <OverlayProvider>
      {isDetailPage && movieId ?
        <MovieDetailPage movies={movies} movieId={movieId} movieDetail={movieDetail}/>
        :
        <MovieHomePage movies={movies}/>
      }
    </OverlayProvider>
  );
}

export default App;
