const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * 텍스트를 HTML 본문이나 속성값에 넣을 수 있도록 특수문자를 엔티티로 바꾼다.
 */
export const escapeHtml = (value: string | number): string =>
  String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
