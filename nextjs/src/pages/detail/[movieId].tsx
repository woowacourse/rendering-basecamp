import { moviesApi } from '@/api/movies';
import Meta from '@/components/common/Meta';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import Home from '..';

export default function Detail({ movies, movieDetail }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : "/no_image.png";
  const pageUrl = `https://rendering-basecamp-eosin.vercel.app/detail/${movieDetail.id}`;
  const title = movieDetail.title;
  const description = movieDetail.overview || '영화 상세 정보';

  return (
    <>
      <Meta
        title={title}
        description={description}
        imageUrl={imageUrl}
        pageUrl={pageUrl}
      />
      <div>
        <Home movies={movies} />
        <MovieDetailModal
          movie={movieDetail}
          onClose={() => {
            router.back();
          }}
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { movieId } = context.params as { movieId: string };
  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(movieId)),
  ])

  return {
    props: {
      movies: popularResponse.data.results,
      movieDetail: detailResponse.data,
    },
  };
};