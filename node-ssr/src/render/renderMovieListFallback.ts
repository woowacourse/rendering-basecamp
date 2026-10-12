export function renderMovieListFallback(): string {
  return /*html*/ `
    <section class="container">
      <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
      <p role="status">인기 영화를 불러올 수 없습니다.</p>
    </section>
  `;
}
