import { MovieItem } from "../types/Movie.types";
import { IconButton } from "./common/IconButton";
import Image from "next/image";
import { FeaturedMovie } from "./FeaturedMovie";

export const Header = ({ featuredMovie }: { featuredMovie: MovieItem }) => {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="background-container">
        {featuredMovie && (
          <Image
            src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${featuredMovie.poster_path}`}
            alt={`${featuredMovie.title} 배경 이미지`}
            fill
            priority
            className="background-image"
          />
        )}

        <div className="overlay" />

        <div className="top-rated-container">
          {/* 로고 + 검색바 섹션 */}
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
