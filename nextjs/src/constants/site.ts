export const SITE = {
    NAME: '라바의 TMDB',
    DESCRIPTION: '껄껄 반갑습니다.',
    LOCALE: 'ko_KR',
    URL: process.env.SITE_URL ?? 'http://localhost:3000',
} as const;
