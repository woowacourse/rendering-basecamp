import type { AppProps } from "next/app"
import { OverlayProvider } from "overlay-kit"
import "./index.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OverlayProvider>
      <Component {...pageProps} />;
    </OverlayProvider>
  )
}
