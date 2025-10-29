import React, { ComponentType } from "react";
import { OverlayProvider } from "overlay-kit";

interface AppProps {
  Component: ComponentType<any>;
  props: any;
}

function App({ Component, props }: AppProps) {
  return (
    <OverlayProvider>
      <Component {...props} />
    </OverlayProvider>
  );
}

export default App;
