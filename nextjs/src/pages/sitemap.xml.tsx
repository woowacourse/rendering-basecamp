import type { GetServerSideProps } from 'next';
import { moviesApi } from '../api/movies';
import { getOrigin } from '../utils/url';

/**
 * 검색엔진에 크롤링할 페이지 목록을 알려주는 sitemap.xml을 요청 시점에 생성한다.
 * 인기 영화 목록이 바뀌어도 항상 최신 상세 페이지 URL이 포함된다.
 */
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const origin = getOrigin(req);

  let movieIds: number[] = [];
  try {
    const response = await moviesApi.getPopular();
    movieIds = response.data.results.map(movie => movie.id);
  } catch {
    // 목록 조회에 실패해도 홈 URL만 담은 sitemap은 제공한다.
  }

  const urls = [`${origin}/`, ...movieIds.map(id => `${origin}/detail/${id}`)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
