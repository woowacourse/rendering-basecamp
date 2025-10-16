import type { MovieDetailResponse } from "@/types/MovieDetail.types";

export type OgMeta = {
  pageTitle: string;
  pageDescription: string;
  ogImageUrl: string;
  ogType: "website";
  ogUrl: string;
};

type Params = {
  origin: string;
  path: string;
  detail?: MovieDetailResponse;
};

const TMDB = "https://image.tmdb.org/t/p";
const pickImage = (backdrop?: string | null, poster?: string | null) =>
  backdrop
    ? `${TMDB}/w780${backdrop}`
    : poster
    ? `${TMDB}/w500${poster}`
    : undefined;

export function buildOgMeta({ origin, path, detail }: Params): OgMeta {
  if (detail) {
    const image = pickImage(detail.backdrop_path, detail.poster_path) ?? "";

    return {
      pageTitle: `${detail.title}`,
      pageDescription: (detail.overview || `${detail.title}의 상세 정보`).slice(
        0,
        120
      ),
      ogImageUrl: image,
      ogType: "website",
      ogUrl: new URL(path || "/", origin).toString(),
    };
  }

  return {
    pageTitle: "인기 영화 목록",
    pageDescription: "최신 인기 영화 정보를 확인하세요 !",
    ogImageUrl: "",
    ogType: "website",
    ogUrl: new URL("/", origin).toString(),
  };
}
