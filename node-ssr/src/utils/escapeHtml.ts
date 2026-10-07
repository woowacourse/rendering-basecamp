const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * 텍스트·속성값에 넣을 문자열의 HTML 특수문자를 치환한다.
 */
export const escapeHtml = (value: string | number) =>
  String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
