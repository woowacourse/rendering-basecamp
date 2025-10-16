import Head from 'next/head';
import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { usePopularMovies } from '../hooks/queries/usePopularMovies';
import { Loading } from '../components/common/Loading';

export default function Home() {
  const { data: movies, isLoading } = usePopularMovies();

  if (isLoading === true) {
    return <Loading />;
  }

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const featuredMovie = movies[0];
  const ogImage = featuredMovie?.poster_path
    ? `https://image.tmdb.org/t/p/original${featuredMovie.poster_path}`
    : '/images/no_image.png';

  return (
    <>
      <Head>
        <title>Movie App - 인기 영화</title>
        <meta name="description" content="최신 인기 영화를 확인하세요" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Movie App - 인기 영화" />
        <meta property="og:description" content="최신 인기 영화를 확인하세요" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL || ''} />
        <meta property="og:site_name" content="Movie App" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Movie App - 인기 영화" />
        <meta name="twitter:description" content="최신 인기 영화를 확인하세요" />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
