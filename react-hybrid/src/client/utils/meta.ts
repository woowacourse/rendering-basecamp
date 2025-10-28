import type { MovieItem } from "../types/Movie.types";
import type { MovieDetailResponse } from "../types/MovieDetail.types";

export type PageMeta = {
  title: string;
  description: string;
  image: string;
  url: string; // absolute or path
};

export function applyMeta(meta: PageMeta) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }
  document.title = meta.title;

  const ensure = (selector: string, create: () => HTMLElement) => {
    return (
      (document.head.querySelector(selector) as HTMLElement | null) ??
      document.head.appendChild(create())
    );
  };

  const og = (property: string) =>
    ensure(`meta[property="${property}"]`, () => {
      const el = document.createElement("meta");
      el.setAttribute("property", property);
      return el;
    });

  const twitter = (name: string) =>
    ensure(`meta[name="${name}"]`, () => {
      const el = document.createElement("meta");
      el.setAttribute("name", name);
      return el;
    });

  const canonical = ensure('link[rel="canonical"]', () => {
    const el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    return el;
  }) as HTMLLinkElement;

  const absoluteUrl = meta.url.startsWith("http")
    ? meta.url
    : `${window.location.origin}${meta.url}`;

  (og("og:title") as HTMLMetaElement).setAttribute("content", meta.title);
  (og("og:description") as HTMLMetaElement).setAttribute(
    "content",
    meta.description
  );
  (og("og:image") as HTMLMetaElement).setAttribute("content", meta.image);
  (og("og:url") as HTMLMetaElement).setAttribute("content", absoluteUrl);
  (og("og:type") as HTMLMetaElement).setAttribute("content", "website");
  (og("og:locale") as HTMLMetaElement).setAttribute("content", "ko_KR");

  (twitter("twitter:card") as HTMLMetaElement).setAttribute(
    "content",
    "summary_large_image"
  );
  (twitter("twitter:title") as HTMLMetaElement).setAttribute(
    "content",
    meta.title
  );
  (twitter("twitter:description") as HTMLMetaElement).setAttribute(
    "content",
    meta.description
  );
  (twitter("twitter:image") as HTMLMetaElement).setAttribute(
    "content",
    meta.image
  );

  canonical.href = absoluteUrl;
}

export function buildHomeMeta(movies?: MovieItem[]): PageMeta {
  const featured = movies?.[0];
  const image = featured?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${featured.backdrop_path}`
    : `/images/logo.png`;
  return {
    title: "영화 리뷰 - 인기 영화 모아보기",
    description: "지금 인기 있는 영화를 확인해보세요.",
    image,
    url: `/`,
  };
}

export function buildDetailMeta(detail: MovieDetailResponse): PageMeta {
  const imagePath = detail.backdrop_path || detail.poster_path || "";
  const image = imagePath
    ? `https://image.tmdb.org/t/p/w1280${imagePath}`
    : `/images/logo.png`;
  const description = detail.overview
    ? detail.overview.slice(0, 140)
    : "영화 상세 정보를 확인해보세요.";
  return {
    title: `${detail.title} - 영화 리뷰`,
    description,
    image,
    url: `/detail/${detail.id}`,
  };
}
