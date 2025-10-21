import { OverlayProvider } from "overlay-kit";
import MovieDetailPage from "./pages/MovieDetailPage";
import MovieHomePage from "./pages/MovieHomePage";
import { InitialData } from "./types/global";

interface AppProps {
  routeType: "home" | "detail";
  initialData: InitialData;
}

function App({ routeType, initialData }: AppProps) {
  const { movies, selectedMovieDetail } = initialData;

  return (
    <OverlayProvider>
      {routeType === "home" && <MovieHomePage initialMovies={movies} />}
      {routeType === "detail" && (
        <MovieDetailPage
          initialMovies={movies}
          selectedMovieDetail={selectedMovieDetail}
        />
      )}
    </OverlayProvider>
  );
}

export default App;
