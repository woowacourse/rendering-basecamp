import React, { ComponentType } from "react";
import { useRoutesContext } from '../../context/RoutesContext';

interface RouteProps {
  path: string;
  element: ComponentType<any>;
}

export function Route({ path, element: Element }: RouteProps) {
  const { serverData, currentPath } = useRoutesContext();

  const data =
    typeof window === "undefined"
      ? serverData
      : (window.__INITIAL_DATA__ ?? serverData);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : currentPath ?? "/";

  const regex = new RegExp("^" + path.replace(/:\w+/g, "([^/]+)") + "$");
  const match = pathname.match(regex);

  if (!match) return null;

  return <Element {...data} />;
}
