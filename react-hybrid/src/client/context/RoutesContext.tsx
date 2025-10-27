// client/contexts/RoutesContext.tsx
import React, { createContext, useContext } from "react";

interface RoutesContextValue {
  serverData?: any;
  currentPath?: string;
}

const RoutesContext = createContext<RoutesContextValue>({
  serverData: undefined,
  currentPath: "/",
});

export const useRoutesContext = () => useContext(RoutesContext);

export const RoutesProvider = ({
  children,
  serverData,
  currentPath,
}: {
  children: React.ReactNode;
  serverData?: any;
  currentPath?: string;
}) => {
  return (
    <RoutesContext.Provider value={{ serverData, currentPath }}>
      {children}
    </RoutesContext.Provider>
  );
};
