import React, { useState, useEffect } from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

function App({
  movies,
  movieDetail,
  movieId,
  initialPath,
}: {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
  movieId?: number;
  initialPath: string;
}) {
  const [currentPath, setCurrentPath] = useState(initialPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const isDetailPage = currentPath.startsWith("/detail/");

  return (
    <OverlayProvider>
      {isDetailPage ? (
        <MovieDetailPage
          movies={movies}
          movieDetail={movieDetail}
          movieId={movieId}
        />
      ) : (
        <MovieHomePage initialMovies={movies} />
      )}
    </OverlayProvider>
  );
}

export default App;
