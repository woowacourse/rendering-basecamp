import assert from "node:assert/strict";
import { test } from "node:test";

// npm run build && npm start 실행 후 검사합니다. 배포 URL도 지정할 수 있습니다.
const baseUrl = (process.env.TEST_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

const readPageData = (html) => {
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  assert.ok(match, "Next.js 초기 props가 HTML에 있어야 합니다.");
  return JSON.parse(match[1]).props.pageProps;
};

const escapeHtml = (text) => text.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;",
}[char]));

const readMeta = (html, name) => {
  const match = html.match(new RegExp(`<meta (?:property|name)="${name}" content="([^"]*)"`));
  assert.ok(match, `${name} 태그가 서버 HTML에 있어야 합니다.`);
  return match[1];
};

test("홈의 첫 HTML에 영화 목록, 상세 링크, 우선 로딩 이미지가 있다", async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  const html = await response.text();
  const { movies } = readPageData(html);
  assert.ok(movies.length > 0);
  const markup = html.split('<script id="__NEXT_DATA__"')[0];

  for (const movie of movies) {
    assert.ok(markup.includes(`<strong>${escapeHtml(movie.title)}</strong>`));
    assert.ok(markup.includes(`href="/detail/${movie.id}"`));
  }
  assert.match(markup, /fetchPriority="high"/i);
  assert.match(markup, /rel="preload" as="image"/);
  assert.doesNotMatch(markup, /loading-spinner/);
});

test("상세 정보와 영화별 OG/SEO 태그를 JavaScript 실행 없이 읽을 수 있다", async () => {
  const home = await fetch(baseUrl);
  const { movies } = readPageData(await home.text());
  const response = await fetch(`${baseUrl}/detail/${movies[0].id}`);
  assert.equal(response.status, 200);
  const html = await response.text();
  const { movie, siteUrl } = readPageData(html);
  const markup = html.split('<script id="__NEXT_DATA__"')[0];

  assert.ok(markup.includes(`id="movie-detail-title" class="modal-title">${escapeHtml(movie.title)}</h1>`));
  assert.ok(markup.includes(escapeHtml(movie.overview || "줄거리 정보가 없습니다.")));
  assert.equal(readMeta(html, "og:title"), escapeHtml(`${movie.title} | 영화 리뷰`));
  assert.match(readMeta(html, "og:image"), /^https?:\/\//);
  assert.equal(readMeta(html, "og:url"), `${siteUrl}/detail/${movie.id}`);
  assert.equal(readMeta(html, "robots"), "index, follow");
  assert.ok(html.includes(`<link rel="canonical" href="${siteUrl}/detail/${movie.id}"`));
});

test("잘못된 영화 ID와 존재하지 않는 영화는 실제 404를 반환한다", async () => {
  for (const id of ["invalid", "0", "-1", "99999999999999999", "2147483647"]) {
    const response = await fetch(`${baseUrl}/detail/${id}`);
    assert.equal(response.status, 404, `id=${id}`);
    assert.match(await response.text(), /영화를 찾을 수 없습니다/);
  }
});

test("robots와 사이트맵에 검색 가능한 상세 URL을 제공한다", async () => {
  const robots = await fetch(`${baseUrl}/robots.txt`);
  assert.equal(robots.status, 200);
  assert.match(robots.headers.get("content-type"), /text\/plain/);
  assert.match(await robots.text(), /Sitemap: https?:\/\/[^\n]+\/sitemap.xml/);

  const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("content-type"), /application\/xml/);
  const xml = await sitemap.text();
  assert.match(xml, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  assert.match(xml, /<loc>https?:\/\/[^<]+\/detail\/\d+<\/loc>/);
});
