import { SITE } from '@/constants/site';

export interface OgImage {
    url: string;
    width: number;
    height: number;
    alt: string;
}

interface MovieImageSource {
    title: string;
    backdrop_path: string | null;
    poster_path: string | null;
}

export const getMovieOgImage = (movie: MovieImageSource): OgImage => {
    if (movie.backdrop_path) {
        return {
            url: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
            width: 1280,
            height: 720,
            alt: movie.title,
        };
    }

    if (movie.poster_path) {
        return {
            url: `https://image.tmdb.org/t/p/w780${movie.poster_path}`,
            width: 780,
            height: 1170,
            alt: movie.title,
        };
    }

    return {
        url: `${SITE.URL}/images/no_image.png`,
        width: 200,
        height: 300,
        alt: movie.title,
    };
};
