import { Movie } from '../service/types';
import { escapeHtml } from '../utils/escapeHtml';
import { thumbnailUrl } from '../utils/image';

interface MovieItemProps {
    movie: Movie;
}

export const MovieItem = ({ movie }: MovieItemProps) => /*html*/ `
    <li class="movie-item">
        <a href="/detail/${movie.id}">
            <div class="item">
                <img
                    class="thumbnail"
                    src="${thumbnailUrl(movie.poster_path)}"
                    alt="${escapeHtml(movie.title)}"
                    loading="lazy"
                />
                <div class="item-desc">
                    <p class="rate">
                        <img src="/images/star_empty.png" class="star" />
                        <span>${movie.vote_average.toFixed(1)}</span>
                    </p>
                    <strong>${escapeHtml(movie.title)}</strong>
                </div>
            </div>
        </a>
    </li>
`;
