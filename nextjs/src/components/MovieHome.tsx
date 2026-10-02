import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { Footer } from "@/components/Footer";
import type { MovieItem } from "@/types/Movie.types";
import Link from "next/link";

export const MovieHome = ({ movies }: { movies: MovieItem[] }) => (
  <div id="wrap">
    {movies[0] && <Header featuredMovie={movies[0]} />}
    {movies.length > 0 ? (
      <MovieList movies={movies} />
    ) : (
      <main className="error-container page-error">
        <p>영화 정보를 불러오는데 실패했습니다.</p>
        <Link href="/" prefetch={false} className="retry-button">다시 시도</Link>
      </main>
    )}
    <Footer />
  </div>
);
