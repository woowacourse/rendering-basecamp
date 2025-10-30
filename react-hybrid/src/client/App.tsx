import React from "react";
import { OverlayProvider } from "overlay-kit";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { Route } from "./components/common/Route";
import { Routes } from './components/common/Routes';
import { MovieItem } from './types/Movie.types';
import { MovieDetailResponse } from './types/MovieDetail.types';

export interface ServerDataByPath {
  "/": { movies: MovieItem[] };
  "/detail/:movieId": {
    movies: MovieItem[];
    detail: MovieDetailResponse;
  };
}
export type PathType = keyof ServerDataByPath;  

interface AppProps<T extends keyof ServerDataByPath>  {
  serverData?: ServerDataByPath[T];
  currentPath?: T;
};

function App({ serverData, currentPath }: AppProps<PathType>) {
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
