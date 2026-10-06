import { useRouter } from 'next/router';

/**
 * 영화 상세 모달이 열려 있는지를 URL 하나로 관리한다.
 * 홈에서는 페이지를 이동하지 않고(shallow) 주소창만 /detail/:id로 바꿔,
 * 공유·새로고침·뒤로가기가 모두 같은 URL을 따라가도록 한다.
 */
export const useMovieDetailRoute = () => {
  const router = useRouter();

  const movieId =
    typeof router.query.movieId === 'string'
      ? Number(router.query.movieId)
      : null;

  const openMovieDetail = (id: number) => {
    router.push({ pathname: '/', query: { movieId: id } }, `/detail/${id}`, {
      shallow: true,
      scroll: false,
    });
  };

  const closeMovieDetail = () => {
    router.push('/', undefined, { shallow: true, scroll: false });
  };

  return { movieId, openMovieDetail, closeMovieDetail };
};
