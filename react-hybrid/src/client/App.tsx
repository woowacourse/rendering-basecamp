import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { Route } from "./components/common/Route";
import { Routes } from './components/common/Routes';

interface AppProps {
  serverData?: any;
  currentPath?: string;
}

function App({ serverData, currentPath }: AppProps) {
  return (
    <OverlayProvider>
      <Routes serverData={serverData} currentPath={currentPath}>
        <Route path="/" element={MovieHomePage} />
        <Route path="/detail/:movieId" element={MovieDetailPage} />
      </Routes>
    </OverlayProvider>
  );
}

export default App;
