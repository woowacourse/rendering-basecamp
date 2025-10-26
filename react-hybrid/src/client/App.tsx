import React from "react";
import { OverlayProvider } from "overlay-kit";

import MovieHomePage from "./pages/MovieHomePage";
import { InitialData, InitialDataProvider } from "./lib/InitialDataContext";

type AppProps = {
  initialData: InitialData | null;
};

function App({ initialData }: AppProps) {
  return (
    <OverlayProvider>
      <InitialDataProvider value={initialData}>
        <MovieHomePage />
      </InitialDataProvider>
    </OverlayProvider>
  );
}

export default App;
