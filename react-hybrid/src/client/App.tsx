import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { Route } from "./components/common/Route";

interface AppProps {
  serverData?: any;
  currentPath?: string;
}

function App({ serverData, currentPath }: AppProps) {
  return (
    <OverlayProvider>
      <Route
        path="/"
        element={MovieHomePage}
        serverData={serverData}
        currentPath={currentPath}
      />
      <Route
        path="/detail/:movieId"
        element={MovieDetailPage}
        serverData={serverData}
        currentPath={currentPath}
      />
    </OverlayProvider>
  );
}

export default App;
