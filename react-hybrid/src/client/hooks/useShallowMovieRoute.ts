import { useEffect } from "react";

export function useShallowMovieRoute({ onCloseModal }) {
  useEffect(() => {
    const handler = () => {
      onCloseModal();
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [onCloseModal]);

  const openShallow = (movieId: number) => {
    window.history.pushState(null, "", `/detail/${movieId}`);
  };

  const closeShallow = () => {
    window.history.replaceState(null, "", "/");
  };

  return { openShallow, closeShallow };
}
