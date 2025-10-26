declare global {
  interface Window {
    __INITIAL_DATA__: {
      routeType: "home" | "detail";
      initialData: {
        movies: MovieItem[];
        movieItem?: MovieDetailResponse;
      };
    };
  }
}

export {};
