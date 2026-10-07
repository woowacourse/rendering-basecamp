const NO_IMAGE = '/images/no_image.png';

export const thumbnailUrl = (path: string | null) =>
    path ? `https://media.themoviedb.org/t/p/w440_and_h660_face${path}` : NO_IMAGE;

export const posterUrl = (path: string | null) => (path ? `https://image.tmdb.org/t/p/original${path}` : NO_IMAGE);

export const backdropUrl = (path: string | null) =>
    path ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${path}` : '';
