import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { moviesApi } from '@/api/movies';
import type { MovieItem as MovieItemType } from '../types/Movie.types';

interface MovieItemProps {
    movie: MovieItemType;
}

export const MovieItem = ({ movie }: MovieItemProps) => {
    const { title, poster_path, vote_average, id } = movie;
    const router = useRouter();
    const { openMovieDetailModal } = useMovieDetailModal();

    const imageUrl = poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : '/images/no_image.png';

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        // Shallow routing: URL만 변경, 페이지 리로드 없음
        router.push(`/detail/${id}`, undefined, { shallow: true });

        // 클라이언트 사이드에서 모달 열기
        const movieDetail = await moviesApi.getDetail(id);
        await openMovieDetailModal(movieDetail.data);

        // 모달 닫히면 홈으로 돌아가기
        router.push('/', undefined, { shallow: true });
    };

    return (
        <li className="movie-item" data-index={id}>
            <Link href={`/detail/${id}`} className="item" onClick={handleClick}>
                <Image
                    className="thumbnail"
                    src={imageUrl}
                    alt={title}
                    width={200}
                    height={300}
                    loading="lazy"
                />
                <div className="item-desc">
                    <p className="rate">
                        <Image src="/images/star_empty.png" className="star" alt="star" width={16} height={16} />
                        <span>{vote_average.toFixed(1)}</span>
                    </p>
                    <strong>{title}</strong>
                </div>
            </Link>
        </li>
    );
};

MovieItem.displayName = 'MovieItem';


