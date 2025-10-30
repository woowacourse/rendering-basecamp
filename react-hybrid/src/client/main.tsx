import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import MovieDetailPage from "./pages/MovieDetailPage";
import MovieHomePage from "./pages/MovieHomePage";

const initialData = window.__INITIAL_DATA__;
console.log("initialData", initialData);

const path = window.location.pathname;
const isDetailPage = path.startsWith("/detail/");

hydrateRoot(
  document.getElementById("root"),
  <App
    Component={isDetailPage ? MovieDetailPage : MovieHomePage}
    pageProps={
      isDetailPage
        ? {
          movies: initialData.movies,
          movieId: initialData.movieDetail?.id,
          movieDetail: initialData.movieDetail,
        }
        : {movies: initialData.movies}}
  />
);
