import Head from "next/head";
import {Header} from "@/components/Header";
import {MovieList} from "@/components/MovieList";
import {Footer} from "@/components/Footer";
import {moviesApi} from "@/api/movies";
import {MovieItem} from "@/types/Movie.types";
import {GetServerSideProps} from "next";

interface HomeProps {
  movies: MovieItem[];
  error: string | null;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const response = await moviesApi.getPopular();
    return {
      props: {
        movies: response.data.results,
        error: null
      }
    };
  } catch (error) {
    console.error('영화 데이터 fetch 실패:', error);
    return {
      props: {
        movies: [],
        error: '영화 정보를 불러오는데 실패했습니다.'
      }
    }
  }
}

export default function Home({movies, error}: HomeProps) {
  if (movies.length === 0 || error) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>인기 영화 목록</title>
        <meta name="description" content="최신 인기 영화를 확인하고 추천받으세요. 영화 평점, 리뷰, 상세 정보 제공"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="인기 영화 목록"/>
        <meta property="og:url" content="https://rendering-basecamp-shinjungoh.vercel.app/"/>
        <meta property="og:title" content="인기 영화 목록"/>
        <meta property="og:description" content="지금 인기 있는 영화를 확인하세요"/>
        <meta property="og:image" content={`https://image.tmdb.org/t/p/w500${movies[0]?.poster_path}`}/>
        <meta property="og:locale" content="ko_KR"/>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="canonical" href="https://rendering-basecamp-shinjungoh.vercel.app/"/>
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]}/>
        <MovieList movies={movies}/>
        <Footer/>
      </div>
    </>
  );
}
