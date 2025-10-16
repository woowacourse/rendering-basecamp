import type { AppProps } from 'next/app';
import { OverlayProvider } from 'overlay-kit';
import '../styles/reset.css';
import '../styles/colors.css';
import '../styles/text.css';
import '../styles/main.css';
import '../styles/thumbnail.css';
import '../styles/modal.css';
import '../styles/animation.css';
import '../styles/media.css';
import '../styles/index.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OverlayProvider>
      <Component {...pageProps} />
    </OverlayProvider>
  );
}
