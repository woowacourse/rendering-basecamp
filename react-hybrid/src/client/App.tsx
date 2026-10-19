import { OverlayProvider } from "overlay-kit";
import { Route, Routes } from "react-router-dom";

import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

import type { MovieItem } from "./types/Movie.types";
import type { MovieDetailResponse } from "./types/MovieDetail.types";

interface Props {
  movies: MovieItem[];
  movie?: MovieDetailResponse;
}

function App({ movies, movie }: Props) {
  return (
    <OverlayProvider>
      <Routes>
        <Route path="/" element={<MovieHomePage initialMovies={movies} />} />

        <Route
          path="/detail/:movieId"
          element={
            movie ? <MovieDetailPage movie={movie} movies={movies} /> : <div>영화 정보를 불러오지 못했습니다.</div>
          }
        />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
