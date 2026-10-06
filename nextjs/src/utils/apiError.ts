import { isAxiosError } from 'axios';

/**
 * TMDB가 "존재하지 않는 리소스"라고 응답했는지 여부
 * (토큰 오류, 서버 장애 같은 다른 실패와 구분해서 404 페이지로 보낼 때 사용)
 */
export const isNotFoundError = (error: unknown) => isAxiosError(error) && error.response?.status === 404;
