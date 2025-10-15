import { OverlayProvider } from "overlay-kit";
import "../styles/index.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OverlayProvider>
      <Component {...pageProps} />
    </OverlayProvider>
  );
}
