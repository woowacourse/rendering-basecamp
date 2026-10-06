const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * HTML 안에 넣을 문자열의 특수문자를 바꾼다.
 * TMDB 데이터에 " 나 < 가 있어도 태그나 속성이 깨지지 않게 한다.
 */
export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
