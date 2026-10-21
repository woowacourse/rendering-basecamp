import { useState } from 'react';
import MovieHomePage from './MovieHomePage';
import { MovieDetailModal } from '../components/MovieDetailModal';
import type { MovieItem } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';

interface MovieDetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

/**
 * 홈 화면 위에 상세 모달이 열린 상태로 렌더링한다.
 * useEffect에서 overlay.open()으로 열면 renderToString 시점에는 모달이 없으므로,
 * 처음부터 JSX에 포함해 서버 HTML에도 모달이 들어가도록 한다.
 */
export default function MovieDetailPage({ movies, movieDetail }: MovieDetailPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <>
      <MovieHomePage movies={movies} />
      {isModalOpen && (
        <MovieDetailModal movie={movieDetail} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
