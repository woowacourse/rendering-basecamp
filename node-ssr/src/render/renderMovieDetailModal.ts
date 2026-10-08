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
    <script>(${initializeMovieDetailModal.toString()})(${renderMovieDetailModalContent.toString()}, ${JSON.stringify(movie ?? null)});</script>
  `;
}

declare global {
  interface Window {
    openMovieDetailModal: (id: string) => Promise<void>;
    closeMovieDetailModal: () => void;
  }
}

function initializeMovieDetailModal(renderContent: (movie: MovieDetail) => string, initialMovie: MovieDetail | null): void {
  let selectedMovie = initialMovie;
  let requestVersion = 0;

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
  };

  window.addEventListener('popstate', () => {
    const match = location.pathname.match(/^\/detail\/(\d+)\/?$/);
    if (match) {
      void window.openMovieDetailModal(match[1]);
    } else {
      const modal = document.querySelector<HTMLDivElement>('#movie-detail-modal')!;
      requestVersion++;
      modal.classList.remove('active');
    }
  });
}
