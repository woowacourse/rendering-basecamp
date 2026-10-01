import { moviesApi } from '@/api/movies';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
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
            <div id="wrap">
                <Header featuredMovie={movies[0]} />
                <MovieList movies={movies} />
                <Footer />
            </div>
        </>
    );
}
