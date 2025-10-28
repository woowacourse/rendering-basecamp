export const navigateToHome = () => {
  window.location.href = '/';
};

export const navigateToMovieDetail = (movieId: number) => {
  window.location.href = `/detail/${movieId}`;
};
