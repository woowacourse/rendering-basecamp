import React from "react";
import { RoutesProvider } from '../../context/RoutesContext';

interface RoutesProps {
  children: React.ReactNode;
  serverData?: any;
  currentPath?: string;
}

export function Routes({ children, serverData, currentPath }: RoutesProps) {
  return (
    <RoutesProvider serverData={serverData} currentPath={currentPath}>
      {children}
    </RoutesProvider>
  );
}
