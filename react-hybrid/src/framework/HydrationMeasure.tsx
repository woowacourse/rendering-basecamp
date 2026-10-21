import { useEffect } from 'react';

export default function HydrationMeasure() {
  useEffect(() => {
    performance.mark('afterCommit');
    performance.measure('hydrationCommit', 'beforeRender', 'afterCommit');
  }, []);

  return null;
}
