import { moviesApi } from '@/api/movies';
import MovieHomePage from '@/components/MovieHomePage';
import { SeoHead } from '@/components/SeoHead';
import { SITE } from '@/constants/site';
import { createServerTiming } from '@/lib/serverTiming';
import { getMovieOgImage } from '@/utils/ogImage';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const timing = createServerTiming();

    const { results: movies } = await timing.measure('tmdb-popular', 'TMDB popular movies', () =>
        moviesApi.getPopular()
    );

    timing.apply(context.res);
    return { props: { movies } };
};

export default function Home({ movies }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const featuredMovie = movies[0] ?? { title: SITE.NAME, backdrop_path: null, poster_path: null };

    return (
        <>
            <SeoHead
                title={SITE.NAME}
                description={SITE.DESCRIPTION}
                url={`${SITE.URL}/`}
                image={getMovieOgImage(featuredMovie)}
            />
            <MovieHomePage movies={movies} />
        </>
    );
}
