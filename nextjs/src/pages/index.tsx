import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { MovieHome } from '../components/MovieHome';
import { MovieDetailModalLoader } from '../components/MovieDetailModalLoader';
import { getFeaturedBackgroundUrl } from '../components/Header';
import { moviesApi } from '../api/movies';
import { getOrigin } from '../utils/url';
import { useMovieDetailRoute } from '../hooks/useMovieDetailRoute';
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
> = async ({ req, res }) => {
  const origin = getOrigin(req);

  try {
    const response = await moviesApi.getPopular();
    return { props: { movies: response.data.results, origin } };
  } catch (error) {
    // 실패 화면이 정상 페이지(200)로 색인되지 않도록 일시적 장애를 뜻하는 503으로 응답한다.
    console.error('[home] 인기 영화 목록 조회 실패', error);
    res.statusCode = 503;
    return { props: { movies: [], origin } };
  }
};

export default function MovieHomePage({ movies, origin }: MovieHomePageProps) {
  const { movieId, closeMovieDetail } = useMovieDetailRoute();
  const featuredMovie = movies[0];

  if (!featuredMovie) {
    return (
      <>
        <Head>
          <title>{SITE_TITLE}</title>
          <meta name="robots" content="noindex" />
        </Head>
        <MovieHome movies={movies} />
      </>
    );
  }

  const imageUrl = featuredMovie.backdrop_path
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
        {/* LCP 이미지인 CSS 배경은 preload scanner가 발견하지 못하므로 head에서 미리 요청한다.
            배경이 모달에 가려지는 상세 페이지에서는 모달 이미지와 경쟁하지 않도록 홈에서만 preload한다. */}
        <link
          rel="preload"
          as="image"
          href={getFeaturedBackgroundUrl(featuredMovie)}
          fetchPriority="high"
        />
      </Head>
      <MovieHome movies={movies} />
      {/* 홈에서 영화를 열면 주소만 /detail/:id로 바뀌고(shallow), 모달은 URL의 movieId를 기준으로 렌더링한다. */}
      {movieId !== null && (
        <MovieDetailModalLoader movieId={movieId} close={closeMovieDetail} />
      )}
    </>
  );
}
