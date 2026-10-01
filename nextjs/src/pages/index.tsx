import { moviesApi } from '@/api/movies';
import MovieHomePage from '@/components/MovieHomePage';
import { SeoHead } from '@/components/SeoHead';
import { SITE } from '@/constants/site';
import { getMovieOgImage } from '@/utils/ogImage';
import { InferGetServerSidePropsType } from 'next';

export const getServerSideProps = async () => {
    const { results: movies } = await moviesApi.getPopular();

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
