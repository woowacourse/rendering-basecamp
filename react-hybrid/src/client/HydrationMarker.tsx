import { useLayoutEffect, type ReactNode } from "react";

export function HydrationMarker({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    performance.mark("hydrationCommitted");
    performance.measure("hydrationCommit", "beforeRender", "hydrationCommitted");
  }, []);

  return children;
}
