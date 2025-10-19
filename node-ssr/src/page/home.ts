interface HomeProps {
  topRatedMovieComponent: string;
  moviesComponent: string;
}

export default function Home({
  topRatedMovieComponent,
  moviesComponent,
}: HomeProps) {
  return /* html */ `
          <!DOCTYPE html>
          <html lang="ko">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="stylesheet" href="/styles/index.css" />
              <title>영화 리뷰</title>
            </head>
            <body>
              <div id="wrap">
                <header>
                  ${topRatedMovieComponent}
                </header>
                <main>
                  <section class="container">
                    <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
                    <ul class="thumbnail-list">
                    ${moviesComponent}
                    </ul>
                  </section>
                </main>
                <footer class="footer">
                  <p>&copy; 우아한테크코스 All Rights Reserved.</p>
                  <p><img src="/images/woowacourse_logo.png" width="180" alt="우아한테크코스" /></p>
                </footer>
              </div>
            </body>
    `;
}
