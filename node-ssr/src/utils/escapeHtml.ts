const ESCAPE_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

// API 응답 문자열을 HTML에 그대로 넣으면 태그로 해석될 수 있어 이스케이프한다.
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);
