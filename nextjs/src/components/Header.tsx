import Head from 'next/head';
import { MovieItem } from '../types/Movie.types';
import { IconButton } from './common/IconButton';
import { FeaturedMovie } from './FeaturedMovie';

export const Header = ({ featuredMovie }: { featuredMovie: MovieItem }) => {
  const backgroundImageUrl = featuredMovie
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${featuredMovie.poster_path}`
    : null;

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header>
      {backgroundImageUrl && (
        <Head>
          <link
            rel="preload"
            as="image"
            href={backgroundImageUrl}
            fetchPriority="high"
          />
        </Head>
      )}
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
