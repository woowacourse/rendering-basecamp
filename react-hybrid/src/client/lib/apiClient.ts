import axios from 'axios';

// 브라우저는 Node 서버에 요청한다. TMDB 토큰은 서버에서만 사용한다.
export const apiClient = axios.create({ baseURL: '/api' });
