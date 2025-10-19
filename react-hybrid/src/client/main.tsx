import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

const initialData = window.__INITIAL_DATA__ as {
  Component: string;
  props: any;
};
console.log("initialData", initialData);

// Component 이름으로 실제 컴포넌트 매핑
const COMPONENTS: Record<string, React.ComponentType<any>> = {
  MovieHomePage,
  MovieDetailPage,
};

const Component = COMPONENTS[initialData.Component];

hydrateRoot(
  document.getElementById("root")!,
  <App Component={Component} props={initialData.props} />
);
