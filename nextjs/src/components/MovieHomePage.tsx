import { MovieItem } from '@/types/Movie.types';
import { Header } from './Header';
import { MovieList } from './MovieList';
import { Footer } from './Footer';
import { ErrorState } from './common/ErrorState';

interface MovieHomePageProps {
    movies: MovieItem[];
}

export default function MovieHomePage({ movies }: MovieHomePageProps) {
    if (movies == null || movies.length === 0) {
        return (
            <div id="wrap">
                <ErrorState
                    title="영화 정보를 불러오는데 실패했습니다."
                    description="일시적인 문제일 수 있어요. 잠시 후 다시 시도해 주세요."
                >
                    <button className="retry-button" onClick={() => window.location.reload()}>
                        다시 시도
                    </button>
                </ErrorState>
                <Footer />
            </div>
        );
    }

    return (
        <div id="wrap">
            <Header featuredMovie={movies[0]} />
            <MovieList movies={movies} />
            <Footer />
        </div>
    );
}
