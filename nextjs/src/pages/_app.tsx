import type { AppProps } from "next/app"
import { OverlayProvider } from "overlay-kit"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OverlayProvider>
      <Component {...pageProps} />;
    </OverlayProvider>
  )
}
