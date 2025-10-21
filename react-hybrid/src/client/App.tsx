import { OverlayProvider } from "overlay-kit";
import MovieDetailPage from "./pages/MovieDetailPage";
import MovieHomePage from "./pages/MovieHomePage";
import { InitialData } from "./types/global";

interface Props {
  routeType: "home" | "detail";
  initialData: InitialData;
}

function App({ routeType, initialData }: Props) {
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
