import Image from "next/image";
import Link from "next/link";
import type { MovieItem } from "@/types/Movie.types";
import { FeaturedMovie } from "@/components/FeaturedMovie";
import { movieImageUrl } from "@/utils/movieImage";

export const Header = ({ featuredMovie }: { featuredMovie: MovieItem }) => (
  <header>
    <div className="background-container">
      <Image
        src={movieImageUrl(featuredMovie.poster_path, "w1920_and_h800_multi_faces")}
        alt=""
        fill
        sizes="100vw"
        priority
        fetchPriority="high"
        unoptimized
        quality={75}
        className="featured-background"
      />
      <div className="overlay" />
      <div className="top-rated-container">
        <Link href="/" className="logo" aria-label="영화 리뷰 홈">
          <Image src="/images/logo.png" width={117} height={20} alt="MovieLogo" />
        </Link>
        <FeaturedMovie movie={featuredMovie} />
      </div>
    </div>
  </header>
);
