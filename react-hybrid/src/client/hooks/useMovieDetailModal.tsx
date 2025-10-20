export const useMovieDetailModal = () => {
  const openMovieDetailModal = (movieId: number) => {
    window.history.pushState({}, "", `/detail/${movieId}`);

    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return { openMovieDetailModal };
};
