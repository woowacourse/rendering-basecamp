import { moviesApi } from '@/api/movies';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import MovieHomePage from '@/components/MovieHomePage';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

export const getServerSideProps = async (context: GetServerSidePropsContext<{ movieId: string }>) => {
    const movieId = Number(context.params?.movieId);

    const [{ results: movies }, movieDetail] = await Promise.all([
        moviesApi.getPopular(),
        moviesApi.getDetail(movieId),
    ]);
    return { props: { movies, movieDetail } };
};

export default function MovieDetail({ movies, movieDetail }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    return (
        <>
            <Head>
                <title>{movieDetail.title}</title>
                <meta property="og:title" content={movieDetail.title} />
                <meta property="og:description" content={movieDetail.overview} />
            </Head>
            <MovieHomePage movies={movies} />
            <MovieDetailModal movie={movieDetail} onClose={() => router.push('/', undefined, { scroll: false })} />
        </>
    );
}
