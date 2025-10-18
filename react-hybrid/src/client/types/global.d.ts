declare global {
  interface Window {
    __INITIAL_DATA__: {
      path: string;
      props: any;
    };
  }
}

export {};
