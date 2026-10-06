import type { GetServerSideProps } from 'next';
import { getOrigin } from '../utils/url';

/**
 * 크롤러에게 전체 페이지 수집을 허용하고 sitemap 위치를 알려준다.
 * sitemap은 절대 URL이어야 하므로 요청 도메인을 기준으로 생성한다.
 */
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const robots = `User-agent: *
Allow: /

Sitemap: ${getOrigin(req)}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.write(robots);
  res.end();

  return { props: {} };
};

export default function Robots() {
  return null;
}
