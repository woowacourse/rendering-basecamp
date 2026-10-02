import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { moviesApi } from "@/api/movies";
import { MovieHome } from "@/components/MovieHome";
import { PageHead } from "@/components/PageHead";
import { getSiteUrl } from "@/lib/siteUrl";
import { movieImageUrl } from "@/utils/movieImage";
import type { MovieItem } from "@/types/Movie.types";

interface HomeProps {
  movies: MovieItem[];
  siteUrl: string;
  hasError: boolean;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ req, res }) => {
  const siteUrl = getSiteUrl(req);

  try {
    const { data } = await moviesApi.getPopular();
    if (data.results.length === 0) throw new Error("인기 영화 목록이 비어 있습니다.");

    // 별점은 sessionStorage에서만 읽으므로 공용 영화 HTML은 CDN에 캐시할 수 있습니다.
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return { props: { movies: data.results, siteUrl, hasError: false } };
  } catch {
    res.statusCode = 503;
    res.setHeader("Cache-Control", "no-store");
    return { props: { movies: [], siteUrl, hasError: true } };
  }
};

export default function Home({ movies, siteUrl, hasError }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const featuredMovie = movies[0];
  const image = movieImageUrl(featuredMovie?.poster_path ?? null, "w1280");

  return (
    <>
      <PageHead
        title="영화 리뷰 | 지금 인기 있는 영화"
        description="지금 인기 있는 영화를 확인하고 나만의 별점을 남겨보세요."
        image={new URL(image, siteUrl).href}
        imageAlt={featuredMovie?.title ?? "영화 리뷰"}
        url={`${siteUrl}/`}
        noIndex={hasError}
      />
      <MovieHome movies={movies} />
    </>
  );
}
