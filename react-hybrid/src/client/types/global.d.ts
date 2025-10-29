declare global {
  interface Window {
    __INITIAL_DATA__: {
      Component: "MovieHomePage" | "MovieDetailPage";
      props: Record<string, any>;
    };
  }
}

export {};
