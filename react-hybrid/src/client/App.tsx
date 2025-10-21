import { overlay, OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";
import { useEffect } from "react";
import { usePopularMovies } from "./hooks/queries/usePopularMovies";
import { MovieDetailModalLoader } from "./components/MovieDetailModalLoader";

function App({
  initialMovies,
  initialDetail,
}: {
  initialMovies: MovieItem[];
  initialDetail?: MovieDetailResponse;
}) {
  const { data: movies, isLoading } = usePopularMovies(initialMovies);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const detailMatch = path.match(/^\/detail\/(\d+)$/);

      if (detailMatch) {
        const movieId = parseInt(detailMatch[1], 10);
        overlay.open(({ unmount }) => (
          <MovieDetailModalLoader
            movieServerData={initialDetail}
            movieId={movieId}
            close={() => {
              unmount();
              if (window.location.pathname !== "/") {
                window.history.pushState({}, "", "/");
              }
            }}
          />
        ));
      } else {
        overlay.unmountAll();
      }
    };

    handlePopState();
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <OverlayProvider>
      <MovieHomePage initialMovies={initialMovies} />
    </OverlayProvider>
  );
}

export default App;
