export function renderFeaturedMovieFallback(): string {
  return /*html*/ `
    <header>
      <div class="background-container">
        <div class="overlay"></div>
        <div class="top-rated-container">
          <img src="/images/logo.png" width="117" height="20" class="logo" alt="MovieLogo" />
          <div class="top-rated-movie" role="status">
            <h1 class="text-3xl font-semibold">추천 영화를 불러올 수 없습니다.</h1>
          </div>
        </div>
      </div>
    </header>
  `;
}
