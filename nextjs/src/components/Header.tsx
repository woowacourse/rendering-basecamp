import Image from "next/image";
import type { MovieItem } from "../types/Movie.types";
import { IconButton } from "./common/IconButton";
import { FeaturedMovie } from "./FeaturedMovie";

export const Header = ({ featuredMovie }: { featuredMovie: MovieItem }) => {
  const handleLogoClick = () => {
    window.location.reload();
  };

  const bgSrc = featuredMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${featuredMovie.backdrop_path}`
    : featuredMovie?.poster_path
    ? `https://image.tmdb.org/t/p/w1280${featuredMovie.poster_path}`
    : undefined;

  return (
    <header>
      <div
        className='background-container'
        style={{
          position: "relative",
          minHeight: "56vw",
          maxHeight: 800,
          overflow: "hidden",
        }}
      >
        {bgSrc && (
          <Image
            src={bgSrc}
            alt={featuredMovie.title}
            fill
            priority
            sizes='100vw'
            style={{ objectFit: "cover" }}
          />
        )}
        <div
          className='overlay'
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,.7) 0%, rgba(0,0,0,.25) 40%, rgba(0,0,0,0) 100%)",
          }}
        />

        <div className='top-rated-container' style={{ position: "relative" }}>
          <IconButton
            src='/images/logo.png'
            width='117'
            height='20'
            onClick={handleLogoClick}
            className='logo'
            alt='MovieLogo'
          />
          {featuredMovie && <FeaturedMovie movie={featuredMovie} />}
        </div>
      </div>
    </header>
  );
};
