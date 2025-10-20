export interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const escapeHtml = (s: string) =>
  (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const SeoHead = ({
  title = "영화 추천 사이트",
  description = "최신 인기 영화 정보를 제공합니다.",
  image = "https://my-movie-app.com/default-og-image.png",
  url = "https://my-movie-app.com",
}: SeoHeadProps) => {
  const t = escapeHtml(title);
  const d = escapeHtml(description);

  return /* html */ `
    <title>${t}</title>
    <meta name="description" content="${d}" />
    <link rel="canonical" href="${url}" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${t} 포스터" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="Movie Reviews" />
    <meta property="og:locale" content="ko_KR" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="${image}" />
  `;
};
