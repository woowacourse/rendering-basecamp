import Image from "next/image";
import Link from "next/link";
import type { MovieItem } from "@/types/Movie.types";

export const FeaturedMovie = ({ movie }: { movie: MovieItem }) => (
  <div className="top-rated-movie">
    <div className="rate">
      <Image src="/images/star_empty.png" width={32} height={32} alt="평점" />
      <span className="text-2xl font-semibold text-yellow">{movie.vote_average}</span>
    </div>
    <h1 className="text-3xl font-semibold">{movie.title}</h1>
    <Link href={`/detail/${movie.id}`} prefetch={false} className="primary detail">
      자세히 보기
    </Link>
  </div>
);
