import { Movie } from '../service/types';
import { escapeHtml } from '../utils/escapeHtml';
import { backdropUrl } from '../utils/image';

interface HeaderProps {
    movie: Movie;
}

export const Header = ({ movie }: HeaderProps) => /*html*/ `
    <header>
        <div class="background-container" style="background-image: url(${backdropUrl(movie.backdrop_path)});">
            <div class="overlay"></div>
            <div class="top-rated-container">
                <a href="/">
                    <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
                </a>
                <div class="top-rated-movie">
                    <div class="rate">
                        <img src="/images/star_empty.png" width="32" height="32" />
                        <span class="text-2xl font-semibold text-yellow">${movie.vote_average.toFixed(1)}</span>
                    </div>
                    <h1 class="text-3xl font-semibold">${escapeHtml(movie.title)}</h1>
                    <a href="/detail/${movie.id}" class="primary detail">자세히 보기</a>
                </div>
            </div>
        </div>
    </header>
`;
