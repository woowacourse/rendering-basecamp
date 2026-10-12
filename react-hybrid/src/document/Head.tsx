import type { ReactNode } from 'react';
import { useAppData } from './context';

interface HeadProps {
  children?: ReactNode;
}

export default function Head({ children }: HeadProps) {
  const { assets, initialPage } = useAppData();

  const renderAssets = typeof window === 'undefined' || initialPage !== undefined;

  return (
    <head>
      {children}
      {renderAssets && assets?.styles.map(href => <link key={href} rel="stylesheet" href={href} />)}
    </head>
  );
}
