import { MovieItem } from '../types/Movie.types';
import { IconButton } from './common/IconButton';
import { FeaturedMovie } from './FeaturedMovie';

/**
 * 추천 영화 배경 이미지 URL. 홈 페이지의 preload와 같은 URL이어야 preload된 이미지가 재사용된다.
 */
export const getFeaturedBackgroundUrl = (movie: MovieItem) =>
  `https://image.tmdb.org/t/p/w1000_and_h450_multi_faces/${movie.poster_path}`;

export const Header = ({ featuredMovie }: { featuredMovie: MovieItem }) => {
  const handleLogoClick = () => {
    window.location.reload();
  };

  const backgroundImageUrl = featuredMovie
    ? getFeaturedBackgroundUrl(featuredMovie)
    : null;

  return (
    <header>
      <div
        className={`background-container`}
        style={
          backgroundImageUrl
            ? { backgroundImage: `url(${backgroundImageUrl})` }
            : undefined
        }
      >
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
