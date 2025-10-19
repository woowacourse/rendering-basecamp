import { Movie } from "../service/types";

interface MovieProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieProps) {
  const { title, poster_path, vote_average } = movie;
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/images/no_image.png";

  return /* html */ `
    <li class="movie-item">
      <a href="/detail/${movie.id}">
        <div class="item">
        <img class="thumbnail" src=${imageUrl} alt=${title} loading="lazy" />
        <div class="item-desc">
            <p class="rate">
            <img src="/images/star_empty.png" class="star" />
            <span>${vote_average.toFixed(1)}</span>
            </p>
            <strong>${title}</strong>
        </div>
        </div>
      </a>
    </li>
  `;
}
