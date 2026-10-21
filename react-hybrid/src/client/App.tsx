import React, { useEffect } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import type { MovieItem } from "./types/Movie.types";
import type { MovieDetailResponse } from "./types/MovieDetail.types";

interface AppProps {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse | null;
}

function App({ movies, movieDetail = null }: AppProps) {
  useEffect(() => {
    // 초기 hydration commit 이후 Effect 실행 시점까지 측정한다.
    performance.mark("afterHydrate");
    performance.measure("hydration", "beforeRender", "afterHydrate");
  }, []);

  return (
    <OverlayProvider>
      <Routes>
        <Route
          element={
            <>
              <MovieHomePage movies={movies} />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={null} />
          <Route
            path="/detail/:id"
            element={<MovieDetailPage initialMovieDetail={movieDetail} />}
          />
        </Route>
        <Route path="*" element={<p>페이지를 찾을 수 없습니다.</p>} />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
