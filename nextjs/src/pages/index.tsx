import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { moviesApi } from '../api/movies';
import { getOrigin } from '../utils/url';
import type { MovieItem } from '../types/Movie.types';

interface MovieHomePageProps {
  movies: MovieItem[];
  origin: string;
}

const SITE_TITLE = '영화 리뷰 | 지금 인기 있는 영화';
const SITE_DESCRIPTION =
  '지금 인기 있는 영화를 한눈에 확인하고, 줄거리와 평점을 살펴본 뒤 나만의 별점을 남겨보세요.';

export const getServerSideProps: GetServerSideProps<
  MovieHomePageProps
> = async ({ req }) => {
  const origin = getOrigin(req);

  try {
    const response = await moviesApi.getPopular();
    return { props: { movies: response.data.results, origin } };
  } catch {
    return { props: { movies: [], origin } };
  }
};

export default function MovieHomePage({ movies, origin }: MovieHomePageProps) {
  const featuredMovie = movies[0];
  const imageUrl = featuredMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${featuredMovie.backdrop_path}`
    : null;

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="canonical" href={`${origin}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={`${origin}/`} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <MovieHome movies={movies} />
    </>
  );
}

/**
 * 홈 화면 본문. 상세 페이지에서도 배경으로 재사용하므로 head 태그는 포함하지 않는다.
 */
export function MovieHome({ movies }: { movies: MovieItem[] }) {
  if (movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}
