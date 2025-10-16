import Image from 'next/image';
import { MovieItem } from '@/types/Movie.types';
import { IconButton } from '@/components/common/IconButton';
import { FeaturedMovie } from '@/components/FeaturedMovie';

export const Header = ({ featuredMovie }: { featuredMovie: MovieItem }) => {
    const handleLogoClick = () => {
        window.location.reload();
    };

    const bgImageUrl = featuredMovie.poster_path
        ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${featuredMovie.poster_path}`
        : '';

    return (
        <header>
            <div className="background-container" style={{ position: 'relative' }}>
                {bgImageUrl && (
                    <Image
                        src={bgImageUrl}
                        alt={featuredMovie.title}
                        fill
                        priority
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        sizes="100vw"
                    />
                )}
                <div className="overlay" />

                <div className="top-rated-container">
                    <IconButton
                        src="/images/logo.png"
                        width="117"
                        height="20"
                        onClick={handleLogoClick}
                        className="logo"
                        alt="MovieLogo"
                    />

                    {featuredMovie && <FeaturedMovie movie={featuredMovie} />}
                </div>
            </div>
        </header>
    );
};


