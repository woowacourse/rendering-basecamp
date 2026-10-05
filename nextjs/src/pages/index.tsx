import { moviesApi } from '@/api/movies';
import { MovieDetailModalLoader } from '@/components/MovieDetailModalLoader';
import MovieHomePage from '@/components/MovieHomePage';
import { SeoHead } from '@/components/SeoHead';
import { SITE } from '@/constants/site';
import { closeMovieDetailModal, useShallowHistoryOnHome } from '@/lib/movieModalRoute';
import { createServerTiming } from '@/lib/serverTiming';
import type { MovieItem } from '@/types/Movie.types';
import { getMovieOgImage } from '@/utils/ogImage';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const timing = createServerTiming();

    try {
        const { results: movies } = await timing.measure('tmdb-popular', 'TMDB popular movies', () =>
            moviesApi.getPopular()
        );
        return { props: { movies } };
    } catch (error) {
        // 500 페이지 대신 홈 안에서 에러 UI(다시 시도)를 보여준다.
        // 상태 코드는 503으로 내려 검색 엔진이 실패 화면을 정상 페이지로 수집하지 않게 한다.
        console.error('[Home] 인기 영화 목록 조회 실패', error);
        context.res.statusCode = 503;
        return { props: { movies: [] as MovieItem[] } };
    } finally {
        timing.apply(context.res);
    }
};

export default function Home({ movies }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    useShallowHistoryOnHome();
    const featuredMovie = movies[0] ?? { title: SITE.NAME, backdrop_path: null, poster_path: null };

    // 사이트 안에서 영화를 클릭하면 shallow 라우팅으로 ?movieId만 바뀐다(주소창은 /detail/:id)
    const selectedMovieId = Number(router.query.movieId);
    const isModalOpen = Number.isInteger(selectedMovieId) && selectedMovieId > 0;

    return (
        <>
            <SeoHead
                title={SITE.NAME}
                description={SITE.DESCRIPTION}
                url={`${SITE.URL}/`}
                image={getMovieOgImage(featuredMovie)}
            />
            <MovieHomePage movies={movies} />
            {isModalOpen && (
                // 목록은 이미 props로 있으니 상세 정보만 브라우저에서 가져온다
                <MovieDetailModalLoader key={selectedMovieId} movieId={selectedMovieId} close={closeMovieDetailModal} />
            )}
        </>
    );
}
