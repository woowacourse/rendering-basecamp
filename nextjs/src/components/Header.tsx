import Image from 'next/image';
import { MovieItem } from '../types/Movie.types';
import { IconButton } from './common/IconButton';
import { FeaturedMovie } from './FeaturedMovie';

export const Header = ({ featuredMovie }: { featuredMovie: MovieItem }) => {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header>
      <div className="background-container">
        {/* LCP 요소: CSS background 대신 img로 렌더링해 preload scanner가 바로 발견하게 하고,
            priority로 <link rel="preload"> + eager 로딩, fetchPriority로 다운로드 우선순위를 높임 */}
        {featuredMovie?.poster_path && (
          <Image
            src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featuredMovie.poster_path}`}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        )}
        <div className="overlay" />

        <div className="top-rated-container">
          {/* 헤더 섹션 (로고 + 검색바) */}
          <IconButton
            src="/images/logo.png"
            width="117"
            height="20"
            onClick={handleLogoClick}
            className="logo"
            alt="MovieLogo"
          />

          {/* 추천 영화 섹션 (검색 모드가 아닐 때만 표시) */}
          {featuredMovie && <FeaturedMovie movie={featuredMovie} />}
        </div>
      </div>
    </header>
  );
};
