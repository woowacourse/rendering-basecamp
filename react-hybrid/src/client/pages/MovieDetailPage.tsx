import { PageProps } from '../../router';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { useLoaderData } from '../hooks/useLoaderData';
import { MovieDetail } from '../components/MovieDetail';
import { Loading } from '../components/common/Loading';
import { Head, SITE_NAME, toOgImageUrl } from '../components/Head';

export default function MovieDetailPage({ params, loader, initialData }: PageProps<MovieDetailResponse>) {
    const { data: movie, error, isLoading } = useLoaderData({ params, loader, initialData });
    if (isLoading === true) {
        return <Loading />;
    }

    if (movie == null || error) {
        return <div>영화 정보를 불러오는데 실패했습니다.{error && `에러 메세지${error}`}</div>;
    }

    return (
        <>
            <Head
                title={`${movie.title} | ${SITE_NAME}`}
                description={movie.overview || `${movie.title}의 상세 정보`}
                image={toOgImageUrl(movie.backdrop_path)}
                type="video.movie"
            />
            <MovieDetail movie={movie} />
        </>
    );
}
