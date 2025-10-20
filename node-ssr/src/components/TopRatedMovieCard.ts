import { Movie } from "../service/types";

interface TopRatedMovieCardProps {
  topRatedMovie: Movie;
}

export default function TopRatedMovieCard({
  topRatedMovie,
}: TopRatedMovieCardProps) {
  return /* html */ `
      <div class="background-container" style="background-image: url(https://image.tmdb.org/t/p/w500${
        topRatedMovie.poster_path
      });">
          <div class="overlay"></div>
          <div class="top-rated-container">
            <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
            <div class="top-rated-movie">
              <div class="rate">
                <img src="/images/star_empty.png" width="32" height="32" />
                <span class="text-2xl font-semibold text-yellow">${topRatedMovie.vote_average.toFixed(
                  1
                )}</span>
              </div>
              <h1 class="text-3xl font-semibold">${topRatedMovie.title}</h1>
              <button class="primary detail" id=${
                topRatedMovie.id
              }>자세히 보기</button>
            </div>
          </div>
        </div>
    `;
}
