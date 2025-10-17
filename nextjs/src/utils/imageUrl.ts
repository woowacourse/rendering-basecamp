import { TMDB_IMAGE_URL } from '@/constants/url';
import { TMDB_NO_IMAGE_URL } from '@/constants/url';

type ImageUrlType = string | null;

export const getImageUrl = (path: ImageUrlType) => {
  return path ? `${TMDB_IMAGE_URL}w500${path}` : TMDB_NO_IMAGE_URL;
};
