declare global {
  interface Window {
    __INITIAL_DATA__?: {
      movies?: any[];
      movieId?: string;
    };
  }
}

export {};
