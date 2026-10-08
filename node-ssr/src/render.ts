import { readFileSync } from "fs";
import path from "path";
import { Movie, MovieDetail } from "./service/types";

const publicDirectory = path.join(__dirname, "../public");
const pageTemplate = readFileSync(path.join(publicDirectory, "index.html"), "utf8");
const itemTemplate = readFileSync(path.join(publicDirectory, "movie-item.html"), "utf8");
const modalTemplate = readFileSync(path.join(publicDirectory, "modal.html"), "utf8");
const stylesDirectory = path.join(publicDirectory, "styles");
// 작은 미션 페이지의 CSS를 HTML에 포함해 첫 화면의 추가 요청을 줄인다.
export const stylesheet = readFileSync(path.join(stylesDirectory, "index.css"), "utf8")
  .replace(/@import\s+['"]\.\/([\w-]+\.css)['"];?/g, (_match, filename: string) =>
    readFileSync(path.join(stylesDirectory, filename), "utf8")
  );

export function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    if (!(key in values)) throw new Error(`템플릿 값 누락: ${key}`);
    return values[key];
  });
}

function imageUrl(imagePath: string | null, size: string): string {
  return imagePath ? `https://image.tmdb.org/t/p/${size}${imagePath}` : "/images/no_image.png";
}

export function renderPage(movies: Movie[], origin: string, detail?: MovieDetail): string {
  const featured = movies[0];
  if (!featured) throw new Error("인기 영화 목록이 비어 있습니다.");

  const title = detail ? `${detail.title} | 영화 리뷰` : "영화 리뷰";
  const description = detail?.overview || (detail ? "줄거리 정보가 없습니다." : "지금 인기 있는 영화들을 만나보세요.");
  const url = `${origin}${detail ? `/detail/${detail.id}` : "/"}`;
  const poster = imageUrl((detail ?? featured).poster_path, "original");
  const ogImage = new URL(poster, origin).href;
  const metadata = `
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="${detail ? "video.movie" : "website"}" />
    <meta property="og:title" content="${escapeHtml(detail?.title ?? title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />`;

  return fill(pageTemplate, {
    pageTitle: escapeHtml(title),
    stylesheet,
    metadata,
    // CSR의 배너 이미지와 같은 영화 포스터를 사용한다.
    banner: escapeHtml(imageUrl(featured.poster_path, "w1920_and_h800_multi_faces")),
    featuredTitle: escapeHtml(featured.title),
    featuredRating: String(featured.vote_average),
    featuredId: String(featured.id),
    movies: movies.map((movie) => fill(itemTemplate, {
      id: String(movie.id),
      title: escapeHtml(movie.title),
      poster: escapeHtml(imageUrl(movie.poster_path, "w500")),
      rating: movie.vote_average.toFixed(1),
    })).join("\n"),
    modal: detail ? fill(modalTemplate, {
      title: escapeHtml(detail.title),
      poster: escapeHtml(imageUrl(detail.poster_path, "original")),
      genres: escapeHtml(detail.genres.map((genre) => genre.name).join(", ")),
      rating: detail.vote_average.toFixed(1),
      overview: escapeHtml(description),
    }) : "",
  });
}
