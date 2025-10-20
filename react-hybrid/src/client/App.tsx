import { OverlayProvider, overlay } from "overlay-kit";
import { useEffect } from "react";
import { MovieDetailModalLoader } from "./components/MovieDetailModalLoader";
import MovieHomePage from "./pages/MovieHomePage";
import { InitialData } from "./types/global";

interface AppProps {
  initialData: InitialData;
}

function App({ initialData }: AppProps) {
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const detailMatch = path.match(/^\/detail\/(\d+)$/);

      if (detailMatch) {
        const movieId = parseInt(detailMatch[1], 10);
        overlay.open(({ unmount }) => (
          <MovieDetailModalLoader
            movieServerData={initialData.movie}
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
      <MovieHomePage moviesServerData={initialData.movies} />
    </OverlayProvider>
  );
}

export default App;
