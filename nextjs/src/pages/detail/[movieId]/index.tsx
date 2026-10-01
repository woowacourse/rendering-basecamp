import { moviesApi } from '@/api/movies';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import MovieHomePage from '@/components/MovieHomePage';
import { SeoHead } from '@/components/SeoHead';
import { SITE } from '@/constants/site';
import { getMovieOgImage } from '@/utils/ogImage';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
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
            <SeoHead
                type="video.movie"
                title={`${movieDetail.title} | ${SITE.NAME}`}
                description={movieDetail.overview || SITE.DESCRIPTION}
                url={`${SITE.URL}/detail/${movieDetail.id}`}
                image={getMovieOgImage(movieDetail)}
            />
            <MovieHomePage movies={movies} />
            <MovieDetailModal movie={movieDetail} onClose={() => router.push('/', undefined, { scroll: false })} />
        </>
    );
}
