const PORT = Number(process.env.PORT ?? 8080);

export const SERVER_PORT = PORT;

// Railway가 배포 시 주입하는 공개 도메인을 사용하고, 없으면 로컬 주소를 사용한다.
export const SITE_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : `http://localhost:${PORT}`;

export const SITE_NAME = "영화 리뷰";
export const SITE_DESCRIPTION = "지금 인기 있는 영화를 확인하고 별점을 남겨보세요.";
