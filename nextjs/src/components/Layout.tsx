import { OverlayProvider } from 'overlay-kit';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <OverlayProvider>{children}</OverlayProvider>;
}
