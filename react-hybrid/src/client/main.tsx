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
  console.error(`지원되지 않는 컴포넌트: ${initialData.Component}`);
  hydrateRoot(
    document.getElementById("root")!,
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
    </div>
  );
} else {
  hydrateRoot(
    document.getElementById("root")!,
    <App Component={Component} props={initialData.props} />
  );
}
