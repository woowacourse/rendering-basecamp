import { MovieItem } from '../types/Movie.types';
import { Link } from 'react-router-dom';
import { FeaturedMovie } from './FeaturedMovie';

export const Header = ({ featuredMovie }: { featuredMovie: MovieItem }) => {
  return (
    <header>
      <div
        className={`background-container`}
        style={
          featuredMovie && {
            backgroundImage: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${featuredMovie.poster_path})`,
          }
        }
      >
        <div className="overlay" />

        <div className="top-rated-container">
          {/* 헤더 섹션 (로고 + 검색바) */}
          <Link to="/" className="logo">
            <img
              src="/static/images/logo.png"
              width="117"
              height="20"
              alt="MovieLogo"
            />
          </Link>

          {/* 추천 영화 섹션 (검색 모드가 아닐 때만 표시) */}
          {featuredMovie && <FeaturedMovie movie={featuredMovie} />}
        </div>
      </div>
    </header>
  );
};
