import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { Loading } from '../components/common/Loading';
import { HomeData, PageProps } from '../../router';
import { useLoaderData } from '../hooks/useLoaderData';

export default function MovieHomePage({ params, loader, initialData }: PageProps<HomeData>) {
    const { data, error, isLoading } = useLoaderData({ params, loader, initialData });
    if (isLoading === true) {
        return <Loading />;
    }
    const movies = data.popular;

    if (movies == null || movies.length === 0 || error) {
        return <div>영화 정보를 불러오는데 실패했습니다.{error && `에러 메세지${error}`}</div>;
    }

    return (
        <div id="wrap">
            <Header featuredMovie={movies[0]} />
            <MovieList movies={movies} />
            <Footer />
        </div>
    );
}
