import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { moviesApi } from '@/api/movies';
import { Button } from '@/components/common/Button';
import type { MovieItem } from '@/types/Movie.types';

interface FeaturedMovieProps {
    movie: MovieItem;
}

export const FeaturedMovie = ({ movie }: FeaturedMovieProps) => {
    const router = useRouter();
    const { openMovieDetailModal } = useMovieDetailModal();

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        router.push(`/detail/${movie.id}`, undefined, { shallow: true });

        const movieDetail = await moviesApi.getDetail(movie.id);
        await openMovieDetailModal(movieDetail.data);

        router.push('/', undefined, { shallow: true });
    };

    return (
        <div className="top-rated-movie">
            <div className="rate">
                <Image src="/images/star_empty.png" width={32} height={32} alt="star" />
                <span className="text-2xl font-semibold text-yellow">
                    {movie.vote_average}
                </span>
            </div>
            <h1 className="text-3xl font-semibold">{movie.title}</h1>
            <Link href={`/detail/${movie.id}`} onClick={handleClick}>
                <Button variant="primary" className="detail">
                    자세히 보기
                </Button>
            </Link>
        </div>
    );
};


