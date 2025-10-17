import Link from 'next/link';
import Image from 'next/image';
import type { MovieItem as MovieItemType } from '../types/Movie.types';

interface MovieItemProps {
    movie: MovieItemType;
}

export const MovieItem = ({ movie }: MovieItemProps) => {
    const { title, poster_path, vote_average, id } = movie;

    const imageUrl = poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : '/images/no_image.png';

    return (
        <li className="movie-item" data-index={id}>
            <Link href={`/detail/${id}`} className="item" scroll={false} shallow={true}>
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


