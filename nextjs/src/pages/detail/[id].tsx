import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import { SeoHead } from "@/components/SeoHead";
import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface MovieDetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

export default function MovieDetailPage({
  movies,
  movieDetail,
}: MovieDetailPageProps) {
  const router = useRouter();

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const handleClose = () => {
    router.push("/");
  };

  const ogImage = `https://image.tmdb.org/t/p/w1280${movieDetail.backdrop_path}`;
  const ogUrl = `https://rendering-basecamp-p53f-j8uw934wj-horse6953-7600s-projects.vercel.app//detail/${movieDetail.id}`;

  return (
    <>
      <SeoHead
        title={movieDetail.title}
        description={movieDetail.overview}
        image={ogImage}
        url={ogUrl}
      />

      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieDetailModal movie={movieDetail} onClose={handleClose} />
        <Footer />
      </div>
    </>
  );
}

// function DetailPageOpenModal() {
//   useEffect(() => {
//     if (movieId == null || onceRef.current === true) {
//       return;
//     }
//     (async () => {
//       onceRef.current = true;
//       const movieDetail = await moviesApi.getDetail(Number(movieId));
//       openMovieDetailModal(movieDetail.data);
//     })();
//   }, [movieId, openMovieDetailModal]);

//   return null;
// }

/**
 * ✅ 서버사이드 렌더링 (SSR)
 *  - 인기 영화 목록 + 특정 영화 상세 정보를 함께 패칭
 */

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    const [popularRes, detailRes] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(id)),
    ]);

    const movies = popularRes.data.results;
    const movieDetail = detailRes.data;

    return {
      props: {
        movies,
        movieDetail,
      },
    };
  } catch (error) {
    console.error("영화 데이터 패칭 실패:", error);
    return {
      props: {
        movies: [],
        movieDetail: null,
      },
    };
  }
};
