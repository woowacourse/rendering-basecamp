import { MovieItem } from '../../client/types/Movie.types';
import { MovieDetailResponse } from '../../client/types/MovieDetail.types';

export type PageMeta = {
  title: string;
  description: string;
  image: string;
  url: string;
};

export function updatePageMeta(meta: PageMeta) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  const absoluteUrl = meta.url.startsWith('http') ? meta.url : `${window.location.origin}${meta.url}`;

  document.title = meta.title;

  updateMetaTag('property', 'og:title', meta.title);
  updateMetaTag('property', 'og:description', meta.description);
  updateMetaTag('property', 'og:image', meta.image);
  updateMetaTag('property', 'og:url', absoluteUrl);
  updateMetaTag('property', 'og:type', 'website');
  updateMetaTag('property', 'og:locale', 'ko_KR');

  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', meta.title);
  updateMetaTag('name', 'twitter:description', meta.description);
  updateMetaTag('name', 'twitter:image', meta.image);

  updateCanonicalLink(absoluteUrl);
}

function updateMetaTag(attr: 'property' | 'name', attrValue: string, content: string) {
  let element = document.head.querySelector(`meta[${attr}="${attrValue}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonicalLink(href: string) {
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.href = href;
}

export function buildOgTags(meta: PageMeta): string {
  const safeTitle = escapeHtml(meta.title);
  const safeDesc = escapeHtml(meta.description);

  return `
    <title>${safeTitle}</title>
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${meta.image}" />
    <meta property="og:url" content="${meta.url}" />
    <meta property="og:locale" content="ko_KR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${meta.image}" />
    <link rel="canonical" href="${meta.url}" />
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function buildHomePageMeta(movies?: MovieItem[]): PageMeta {
  const featured = movies?.[0];
  const image = featured?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${featured.backdrop_path}`
    : `/images/logo.png`;

  return {
    title: '영화 리뷰 - 인기 영화 모아보기',
    description: '지금 인기 있는 영화를 확인해보세요.',
    image,
    url: '/',
  };
}

export function buildDetailPageMeta(detail: MovieDetailResponse): PageMeta {
  const imagePath = detail.backdrop_path || detail.poster_path || '';
  const image = imagePath ? `https://image.tmdb.org/t/p/w1280${imagePath}` : `/images/logo.png`;
  const description = detail.overview ? detail.overview.slice(0, 140) : '영화 상세 정보를 확인해보세요.';

  return {
    title: `${detail.title} - 영화 리뷰`,
    description,
    image,
    url: `/detail/${detail.id}`,
  };
}
