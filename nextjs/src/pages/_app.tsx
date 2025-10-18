import type { AppProps } from "next/app";
import { OverlayProvider } from "overlay-kit";
import "../styles/index.css";
import "./App.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OverlayProvider>
      <Component {...pageProps} />
    </OverlayProvider>
  );
}
