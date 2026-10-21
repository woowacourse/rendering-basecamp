import React, { useLayoutEffect } from "react";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieDetailModalProvider } from "./hooks/useMovieDetailModal";
import type { InitialData } from "./types/InitialData.types";

interface AppProps {
  initialData: InitialData;
}

function App({ initialData }: AppProps) {
  // 레이아웃 이펙트는 서버에서 실행되지 않고, 클라이언트에서 하이드레이션이 커밋된 직후 실행된다.
  useLayoutEffect(() => {
    performance.mark("hydrationCommitted");
    performance.measure("hydration (commit)", "beforeRender", "hydrationCommitted");
  }, []);

  return (
    <MovieDetailModalProvider initialMovie={initialData.movieDetail}>
      <MovieHomePage movies={initialData.movies} />
    </MovieDetailModalProvider>
  );
}

export default App;
