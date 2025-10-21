import { OverlayProvider } from "overlay-kit";
import MovieDetailPage from "./pages/MovieDetailPage";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

interface InitialData {
  movies: MovieItem[];
  selectedMovieDetail?: MovieDetailResponse;
}

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
