declare global {
  interface Window {
    __INITIAL_DATA__: {
      movies: import("./Movie.types").MovieItem[];
      detail?: import("./MovieDetail.types").MovieDetailResponse;
    };
  }
}

export {};
