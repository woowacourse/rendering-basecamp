import type { MovieDetail } from '../service/types';
import { renderMovieDetailModalContent } from './renderMovieDetailModalContent';

export function renderMovieDetailModal(movie?: MovieDetail): string {
  const children = movie ? renderMovieDetailModalContent(movie) : '';

  return /*html*/ `
    <div
      id="movie-detail-modal"
      class="modal-background ${children ? 'active' : ''}"
      data-state="${children ? 'success' : 'loading'}"
      data-movie-id="${movie?.id ?? ''}"
      onclick="if (event.target === this) window.closeMovieDetailModal();"
      onkeydown="if (event.key === 'Escape') window.closeMovieDetailModal();"
      tabindex="-1"
    >
      <div class="modal-loading" role="status" aria-label="영화 정보를 불러오는 중입니다.">
        <div class="loading-spinner" aria-hidden="true"></div>
      </div>
      <div class="modal">
        <div class="modal-error" role="alert">
          <div class="modal-header">
            <p>내용을 불러올 수 없습니다.</p>
            <button type="button" class="modal-close-btn" onclick="window.closeMovieDetailModal();" aria-label="닫기">×</button>
          </div>
        </div>
        <div class="modal-content">${children}</div>
      </div>
    </div>
    <script>
      ${initializeMyRating.toString()}
      ${renderMovieDetailModalContent.toString()}
      ${initializeMovieDetailModal.toString()}

      initializeMovieDetailModal(renderMovieDetailModalContent, ${JSON.stringify(movie ?? null)});
    </script>
  `;
}

declare global {
  interface Window {
    openMovieDetailModal: (id: string) => Promise<void>;
    closeMovieDetailModal: () => void;
  }
}

function initializeMovieDetailModal(
  renderContent: (movie: MovieDetail) => string,
  initialMovie: MovieDetail | null,
): void {
  let selectedMovie = initialMovie;
  let requestVersion = 0;
  const origin = new URL(document.querySelector<HTMLMetaElement>('meta[property="og:url"]')!.content).origin;

  function updateMetadata(movie?: MovieDetail): void {
    const title = movie ? `${movie.title} | 영화 리뷰` : '영화 리뷰';
    document.title = title;
    const metadata = {
      'og:title': title,
      'og:type': movie ? 'video.movie' : 'website',
      'og:url': new URL(movie ? `/detail/${movie.id}` : '/', origin).href,
      'og:image': movie?.poster_path
        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
        : new URL('/images/og_default.png', origin).href,
      'og:description': movie
        ? movie.overview || '줄거리 정보가 없습니다.'
        : '인기 영화를 살펴보고 나만의 별점을 남겨보세요.',
    };
    Object.entries(metadata).forEach(([property, value]) => {
      document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)!.content = value;
    });
  }

  window.openMovieDetailModal = async (id) => {
    const modal = document.querySelector<HTMLDivElement>('#movie-detail-modal')!;
    const content = modal.querySelector<HTMLDivElement>('.modal-content')!;
    const version = ++requestVersion;
    modal.classList.add('active');

    try {
      if (!selectedMovie || String(selectedMovie.id) !== id) {
        modal.dataset.state = 'loading';
        const response = await fetch('/api/movies/' + encodeURIComponent(id));
        if (!response.ok) throw new Error('영화 상세 조회 실패');
        const movie: MovieDetail = await response.json();
        if (version !== requestVersion) return;
        content.innerHTML = renderContent(movie);
        selectedMovie = movie;
        modal.dataset.movieId = id;
      }
      initializeMyRating(selectedMovie!);
      updateMetadata(selectedMovie!);
      modal.dataset.state = 'success';
      if (location.pathname !== '/detail/' + id) history.pushState(null, '', '/detail/' + id);
    } catch (error) {
      if (version !== requestVersion) return;
      console.error(error);
      modal.dataset.state = 'error';
    }
  };

  window.closeMovieDetailModal = () => {
    const modal = document.querySelector<HTMLDivElement>('#movie-detail-modal')!;
    requestVersion++;
    modal.classList.remove('active');
    history.replaceState(null, '', '/');
    updateMetadata();
  };

  if (initialMovie) initializeMyRating(initialMovie);

  window.addEventListener('popstate', () => {
    const match = location.pathname.match(/^\/detail\/(\d+)\/?$/);
    if (match) {
      void window.openMovieDetailModal(match[1]);
    } else {
      const modal = document.querySelector<HTMLDivElement>('#movie-detail-modal')!;
      requestVersion++;
      modal.classList.remove('active');
      updateMetadata();
    }
  });
}

function initializeMyRating(movie: MovieDetail): void {
  const container = document.querySelector<HTMLDivElement>('#movie-detail-modal .star-rating')!;
  let ratings: { movieId: number; movieName: string; rate: number; rateDate: string }[] = [];
  try {
    ratings = JSON.parse(sessionStorage.getItem('movie-ratings') ?? '[]');
  } catch (error) {
    console.error('내 별점 조회 실패:', error);
  }
  const rating = ratings.find((item) => item.movieId === movie.id)?.rate ?? 0;
  const scoreText: Record<number, string> = {
    2: '최악이에요',
    4: '별로예요',
    6: '보통이에요',
    8: '재미있어요',
    10: '명작이에요',
  };

  container.innerHTML = Array.from({ length: 5 }, (_, index) => {
    const score = (index + 1) * 2;
    return /*html*/ `
      <button type="button" data-score="${score}">
        <img
          src="/images/star_${score <= rating ? 'filled' : 'empty'}.png"
          width="24"
          height="24"
          alt="Star ${index + 1}"
        />
      </button>
    `;
  }).join('') + `<span class="rating-text">${rating} ${scoreText[rating] ?? '별점을 남겨주세요'}</span>`;
  container.removeAttribute('aria-busy');
  container.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
    button.onclick = () => {
      const rate = Number(button.dataset.score);
      const existing = ratings.find((item) => item.movieId === movie.id);
      if (existing) {
        existing.rate = rate;
      } else {
        ratings.push({
          movieId: movie.id,
          movieName: movie.title,
          rate,
          rateDate: new Date().toISOString(),
        });
      }
      try {
        sessionStorage.setItem('movie-ratings', JSON.stringify(ratings));
      } catch (error) {
        console.error('내 별점 저장 실패:', error);
      }
      initializeMyRating(movie);
    };
  });
}
