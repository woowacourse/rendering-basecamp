import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import type { InitialData } from "./types/InitialData.types";

interface AppProps {
  initialData: InitialData;
}

function App({ initialData }: AppProps) {
  const { movies, movieDetail } = initialData;

  return (
    <OverlayProvider>
      {movieDetail ? (
        <MovieDetailPage movies={movies} movieDetail={movieDetail} />
      ) : (
        <MovieHomePage movies={movies} />
      )}
    </OverlayProvider>
  );
}

export default App;
