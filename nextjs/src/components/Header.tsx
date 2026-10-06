import Link from 'next/link';
import type { MovieItem } from '../types/Movie.types';
import { FeaturedMovie } from './FeaturedMovie';

interface HeaderProps {
  featuredMovie?: MovieItem | null;
  error?: Error | null;
}

export const Header = ({ featuredMovie, error }: HeaderProps) => {
  return (
    <header>
      <div
        className={`background-container`}
        style={
          !error && featuredMovie?.poster_path
            ? {
                backgroundImage: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${featuredMovie.poster_path})`,
              }
            : undefined
        }
      >
        <div className="overlay" />

        <div className="top-rated-container">
          {/* 헤더 섹션 (로고 + 검색바) */}
          <Link href="/" scroll={false} className="logo">
            <img src="/images/logo.png" width="117" height="20" alt="MovieLogo" />
          </Link>

          {/* 추천 영화 섹션 (검색 모드가 아닐 때만 표시) */}
          <FeaturedMovie movie={featuredMovie} error={error} />
        </div>
      </div>
    </header>
  );
};
