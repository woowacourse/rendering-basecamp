/** HTML 텍스트나 속성 값에 넣을 문자열을 이스케이프한다. */
const escapeHtml = (value: string): string => {
	const entities: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
	};

	return value.replace(/[&<>"']/g, (character) => entities[character]);
};

export default escapeHtml;
