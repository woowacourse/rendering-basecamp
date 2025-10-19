declare global {
  interface Window {
    __INITIAL_DATA__: {
      Component: string;
      props: any;
    };
  }
}

export {};
