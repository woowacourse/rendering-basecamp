export const getImageUrl = (
  path: string | null,
  size: string = 'original'
): string => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getThumbnailUrl = (path: string | null): string => {
  return getImageUrl(path, 'w440_and_h660_face');
};

export const getBannerUrl = (path: string | null): string => {
  return getImageUrl(path, 'w1920_and_h800_multi_faces');
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const GENRE_MAP: Record<number, string> = {
  28: '액션',
  12: '모험',
  16: '애니메이션',
  35: '코미디',
  80: '범죄',
  99: '다큐멘터리',
  18: '드라마',
  10751: '가족',
  14: '판타지',
  36: '역사',
  27: '공포',
  10402: '음악',
  9648: '미스터리',
  10749: '로맨스',
  878: 'SF',
  10770: 'TV 영화',
  53: '스릴러',
  10752: '전쟁',
  37: '서부',
};

export const getGenreNames = (genreIds: number[]): string => {
  return genreIds
    .map((id) => GENRE_MAP[id])
    .filter(Boolean)
    .join(', ');
};

export const getGenreNamesFromDetail = (
  genres: { id: number; name: string }[]
): string => {
  return genres.map((genre) => genre.name).join(', ');
};
