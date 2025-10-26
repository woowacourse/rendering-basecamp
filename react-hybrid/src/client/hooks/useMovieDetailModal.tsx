export const useMovieDetailModal = () => {
  const openDetailModal = (movieId: number) => {
    window.history.pushState({}, "", `/detail/${movieId}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  return { openDetailModal };
};
