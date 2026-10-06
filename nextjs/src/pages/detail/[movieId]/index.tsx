import { moviesApi } from '@/api/movies';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import MovieHomePage from '@/components/MovieHomePage';
import { SeoHead } from '@/components/SeoHead';
import { SITE } from '@/constants/site';
import { createServerTiming } from '@/lib/serverTiming';
import { isNotFoundError } from '@/utils/apiError';
import { getMovieOgImage } from '@/utils/ogImage';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';

export const getServerSideProps = async (context: GetServerSidePropsContext<{ movieId: string }>) => {
    const movieId = Number(context.params?.movieId);

    // /detail/abc, /detail/1.5 처럼 영화 id가 될 수 없는 값은 TMDB에 요청하지 않고 바로 404
    if (!Number.isInteger(movieId) || movieId <= 0) {
        return { notFound: true };
    }

    const timing = createServerTiming();

    try {
        // 상세는 필수, 인기 목록(배경)은 실패해도 모달은 보여줄 수 있도록 allSettled 사용
        const [popularResult, detailResult] = await Promise.allSettled([
            timing.measure('tmdb-popular', 'TMDB popular movies', () => moviesApi.getPopular()),
            timing.measure('tmdb-detail', 'TMDB movie detail', () => moviesApi.getDetail(movieId)),
        ]);

        if (detailResult.status === 'rejected') {
            // 존재하지 않는 영화 → 404 페이지, 그 외(토큰 오류, TMDB 장애 등) → 500 페이지
            if (isNotFoundError(detailResult.reason)) {
                return { notFound: true };
            }
            throw detailResult.reason;
        }

        if (popularResult.status === 'rejected') {
            console.error('[MovieDetail] 인기 영화 목록 조회 실패', popularResult.reason);
        }

        const movies = popularResult.status === 'fulfilled' ? popularResult.value.results : [];
        return { props: { movies, movieDetail: detailResult.value } };
    } finally {
        timing.apply(context.res);
    }
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
