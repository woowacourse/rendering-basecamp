import { OverlayProvider } from "overlay-kit";
import type { ComponentType } from "react";

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
