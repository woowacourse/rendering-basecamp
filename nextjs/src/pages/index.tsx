import { moviesApi } from '@/api/movies';
import MovieHomePage from '@/components/MovieHomePage';
import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

export const getServerSideProps = async () => {
    const { results: movies } = await moviesApi.getPopular();

    return { props: { movies } };
};

export default function Home({ movies }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <Head>
                <title>라바의 TMDB</title>
                <meta name="description" content="껄껄 안녕하세요." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MovieHomePage movies={movies} />
        </>
    );
}
