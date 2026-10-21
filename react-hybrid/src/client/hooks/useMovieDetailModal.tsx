import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { moviesApi } from '../api/movies';
import { getDetailPath, parseDetailMovieId } from '../utils/path';

const DEFAULT_TITLE = '영화 리뷰';

interface MovieDetailModalContextValue {
  openMovieDetailModal: (movieId: number) => Promise<void>;
}

const MovieDetailModalContext =
  createContext<MovieDetailModalContextValue | null>(null);

interface MovieDetailModalProviderProps {
  initialMovie: MovieDetailResponse | null;
  children: ReactNode;
}

/**
 * 모달을 상태로 관리해 서버에서도 렌더링할 수 있게 한다.
 * (/detail/:id 요청 시 서버가 내려준 영화 상세로 모달이 열린 HTML 을 만들고, 같은 상태로 하이드레이션한다.)
 */
export const MovieDetailModalProvider = ({
  initialMovie,
  children,
}: MovieDetailModalProviderProps) => {
  const [movie, setMovie] = useState<MovieDetailResponse | null>(initialMovie);
  const latestRequestRef = useRef(0);

  const showMovie = useCallback(async (movieId: number) => {
    const requestId = ++latestRequestRef.current;
    const movieDetail = await moviesApi.getDetail(movieId);

    // 응답이 늦게 도착한 이전 요청이 최신 모달을 덮어쓰지 않도록 한다.
    if (requestId === latestRequestRef.current) {
      setMovie(movieDetail);
    }
  }, []);

  const openMovieDetailModal = useCallback(
    async (movieId: number) => {
      await showMovie(movieId);
      window.history.pushState(null, '', getDetailPath(movieId));
    },
    [showMovie]
  );

  const closeMovieDetailModal = useCallback(() => {
    latestRequestRef.current++;
    setMovie(null);
    window.history.pushState(null, '', '/');
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const movieId = parseDetailMovieId(window.location.pathname);

      if (movieId == null) {
        latestRequestRef.current++;
        setMovie(null);
        return;
      }

      showMovie(movieId).catch(() => setMovie(null));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showMovie]);

  useEffect(() => {
    document.title = movie ? `${movie.title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  }, [movie]);

  const value = useMemo(
    () => ({ openMovieDetailModal }),
    [openMovieDetailModal]
  );

  return (
    <MovieDetailModalContext.Provider value={value}>
      {children}
      {movie && (
        <MovieDetailModal
          key={movie.id}
          movie={movie}
          onClose={closeMovieDetailModal}
        />
      )}
    </MovieDetailModalContext.Provider>
  );
};

export const useMovieDetailModal = () => {
  const context = useContext(MovieDetailModalContext);

  if (context == null) {
    throw new Error(
      'useMovieDetailModal 은 MovieDetailModalProvider 안에서 사용해야 합니다.'
    );
  }

  return context;
};
