import React from "react";
import { OverlayProvider } from "overlay-kit";

interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

function App({ Component, pageProps }: AppProps) {
  return (
    <OverlayProvider>
      <Component { ...pageProps } />
    </OverlayProvider>
  );
}

export default App;
