import axios from 'axios';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

const apiClient = axios.create({
  baseURL: TMDB_API_BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
  },
});

export const moviesApi = {
  getPopular: async (page: number = 1) => {
    const response = await apiClient.get(`/movie/popular?page=${page}&language=ko-KR`);
    return response.data;
  },

  getDetail: async (id: number) => {
    const response = await apiClient.get(`/movie/${id}?language=ko-KR`);
    return response.data;
  },
};
