import type { AppProps } from "next/app";
import { OverlayProvider } from "overlay-kit";
import "../styles/index.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OverlayProvider>
      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'system-ui', 'Roboto',
            'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR',
            'Malgun Gothic', sans-serif;
        }
      `}</style>
      <Component {...pageProps} />
    </OverlayProvider>
  );
}
