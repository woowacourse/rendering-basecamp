import { apiClient } from '../lib/apiClient';
import type { MovieResponse } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';

export const moviesApi = {
    /**
     * 인기 영화 목록 조회
     */
    getPopular: async (page: number = 1) => {
        const { data } = await apiClient.get<MovieResponse>(`/movie/popular?page=${page}&language=ko-KR`);
        return data;
    },

    /**
     * 영화 상세 정보 조회
     */
    getDetail: async (id: number) => {
        const { data } = await apiClient.get<MovieDetailResponse>(`/movie/${id}?language=ko-KR`);
        return data;
    },
} as const;
