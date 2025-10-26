declare global {
  interface Window {
    __INITIAL_DATA__: {
      page: 'home';
      initialData: {
        movies: MovieItem[];
      };
    };
  }
}
export {};
