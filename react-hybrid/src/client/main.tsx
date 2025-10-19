import React, { ComponentType } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

const COMPONENTS = {
  MovieHomePage,
  MovieDetailPage,
} as const satisfies Record<string, ComponentType<any>>;

const initialData = window.__INITIAL_DATA__;

const Component = COMPONENTS[initialData.Component];

if (!Component) {
  throw new Error(`지원되지 않는 컴포넌트: ${initialData.Component}`);
}

hydrateRoot(
  document.getElementById("root")!,
  <App Component={Component} props={initialData.props} />
);
