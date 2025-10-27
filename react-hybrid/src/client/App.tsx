import { OverlayProvider } from "overlay-kit";
import { MovieHomePage } from "./pages/MovieHomePage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

interface AppProps {
  routeType: "home" | "detail";
  initialData: {
    movies: MovieItem[];
    selectedMovieDetail?: MovieDetailResponse;
  };
}

const App = ({ routeType, initialData }: AppProps) => {
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
};

export default App;
