import { ComponentType } from 'react';
import { MovieItem } from './client/types/Movie.types';
import { moviesApi } from './client/api/movies';
import MovieHomePage from './client/pages/MovieHomePage';
import { MovieDetailResponse } from './client/types/MovieDetail.types';
import MovieDetailPage from './client/pages/MovieDetailPage';

export type Params = Record<string, string>;

export interface PageProps<Data> {
    params: Params;
    loader: (params: Params) => Promise<Data>;
    initialData?: Data;
}

export interface Route<Data> {
    path: string;
    component: ComponentType<PageProps<Data>>;
    loader: (params: Params) => Promise<Data>;
}

export interface Meta {
    title: string;
    description: string;
    image?: string;
}

export interface HomeData {
    popular: MovieItem[];
}

const homeRoute: Route<HomeData> = {
    path: '/',
    component: MovieHomePage,
    loader: async () => {
        const { data } = await moviesApi.getPopular();
        return { popular: data.results };
    },
};

const detailRoute: Route<MovieDetailResponse> = {
    path: '/detail/:id',
    component: MovieDetailPage,
    loader: async (params) => {
        const { data } = await moviesApi.getDetail(Number(params.id));
        return data;
    },
};

export const routes: Route<any>[] = [homeRoute, detailRoute];

export const matchRoute = (pathname: string): { route: Route<any>; params: Params } | null => {
    const target = pathname.split('/').filter(Boolean);

    for (const route of routes) {
        const pattern = route.path.split('/').filter(Boolean);
        if (pattern.length !== target.length) continue;

        const params: Params = {};
        const isMatch = pattern.every((patternSegment, i) => {
            if (patternSegment.startsWith(':')) {
                params[patternSegment.slice(1)] = decodeURIComponent(target[i]);
                return true;
            }
            return patternSegment === target[i];
        });

        if (isMatch) return { route, params };
    }

    return null;
};
