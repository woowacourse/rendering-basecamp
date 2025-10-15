import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { moviesApi } from '@/api/movies';

export default function DetailPageOpenModal() {
  const router = useRouter();
  const { movieId } = router.query; // useParams() → router.query
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      await openMovieDetailModal(movieDetail.data);
      // 모달이 닫히면 이전 페이지로 돌아가기
      router.back();
    })();
  }, [movieId, openMovieDetailModal, router]);

  return null;
}
