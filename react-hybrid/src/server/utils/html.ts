const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * HTML 안(태그 내용, 속성 값)에 넣을 문자열의 특수문자를 바꾼다.
 */
export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);

/**
 * <script> 안에 넣을 데이터를 JSON 문자열로 바꾼다.
 * 데이터에 "</script>"가 들어 있어도 스크립트가 중간에 끝나지 않도록 < 를 < 로 바꾼다.
 */
export const serializeForScript = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c");
